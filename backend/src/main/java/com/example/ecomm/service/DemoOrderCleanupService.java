package com.example.ecomm.service;

import com.example.ecomm.model.Order;
import com.example.ecomm.model.User;
import com.example.ecomm.repository.OrderRepository;
import com.example.ecomm.repository.PaymentRepository;
import com.example.ecomm.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Periodically cleans up stale orders belonging ONLY to the demo user.
 * Real users' orders are never queried or deleted by this service.
 *
 * SAFETY: Still scoped ONLY to username=demo + age filter. Real users are never touched.
 */
@Service
public class DemoOrderCleanupService {

    private static final Logger log = LoggerFactory.getLogger(DemoOrderCleanupService.class);

    /** Must match DemoUserSeeder username. */
    private static final String DEMO_USERNAME = "demo";

    /** Orders older than this duration (for the demo user only) are candidates for cleanup. */
    private static final int ORDER_TTL_MINUTES = 45;

    /**
     * When true, candidates are only logged — nothing is deleted.
     * false = real delete enabled for expired demo orders only (verified via H2 tests).
     */
    private static final boolean DRY_RUN = false;

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public DemoOrderCleanupService(
            UserRepository userRepository,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Runs every 10 minutes. Finds demo-user orders older than {@link #ORDER_TTL_MINUTES}.
     * Query is always scoped: user = demo AND createdAt &lt; (now - 45 minutes).
     *
     * @return IDs of demo orders that are cleanup candidates (also used by tests / dry-run asserts)
     */
    @Scheduled(fixedDelayString = "600000", initialDelayString = "60000")
    @Transactional
    public List<Long> cleanupExpiredDemoOrders() {
        Optional<User> demoUserOpt = userRepository.findByUsername(DEMO_USERNAME);
        if (demoUserOpt.isEmpty()) {
            log.info("Demo order cleanup skipped: user '{}' not found", DEMO_USERNAME);
            return Collections.emptyList();
        }

        User demoUser = demoUserOpt.get();
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(ORDER_TTL_MINUTES);

        // CRITICAL: always filter by demo user — never delete by age alone
        List<Order> expiredDemoOrders = orderRepository.findByUserAndCreatedAtBefore(demoUser, cutoff);

        if (expiredDemoOrders.isEmpty()) {
            log.debug(
                    "Demo order cleanup: no orders for user='{}' older than {} minutes (cutoff={})",
                    DEMO_USERNAME,
                    ORDER_TTL_MINUTES,
                    cutoff);
            return Collections.emptyList();
        }

        log.info(
                "Demo order cleanup: found {} order(s) for user='{}' with createdAt < {} (DRY_RUN={})",
                expiredDemoOrders.size(),
                DEMO_USERNAME,
                cutoff,
                DRY_RUN);

        List<Long> candidateIds = new ArrayList<>();

        for (Order order : expiredDemoOrders) {
            candidateIds.add(order.getId());

            if (DRY_RUN) {
                log.info(
                        "DRY-RUN: would delete order id={} (user={}, createdAt={})",
                        order.getId(),
                        DEMO_USERNAME,
                        order.getCreatedAt());
                continue;
            }

            // Real delete path (disabled while DRY_RUN=true)
            // Delete linked payment first (no FK cascade from Order → Payment)
            paymentRepository.findByOrderId(order.getId()).ifPresent(payment -> {
                paymentRepository.delete(payment);
                log.info("Deleted payment id={} for demo order id={}", payment.getId(), order.getId());
            });

            // OrderItems cascade via Order.orderItems (CascadeType.ALL + orphanRemoval)
            // Product rows are NOT deleted (OrderItem → Product is ManyToOne without cascade remove)
            orderRepository.delete(order);
            log.info(
                    "Deleted demo order id={} (user={}, createdAt={})",
                    order.getId(),
                    DEMO_USERNAME,
                    order.getCreatedAt());
        }

        if (DRY_RUN) {
            log.info(
                    "DRY-RUN complete: {} demo order(s) logged, none deleted. Set DRY_RUN=false to enable real deletes.",
                    expiredDemoOrders.size());
        }

        return candidateIds;
    }
}
