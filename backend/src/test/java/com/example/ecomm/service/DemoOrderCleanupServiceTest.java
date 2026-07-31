package com.example.ecomm.service;

import com.example.ecomm.DataSeeder;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.OrderItem;
import com.example.ecomm.model.User;
import com.example.ecomm.repository.OrderItemRepository;
import com.example.ecomm.repository.OrderRepository;
import com.example.ecomm.repository.UserRepository;
import com.example.ecomm.seeder.DemoUserSeeder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Isolated H2 integration test for real demo-order cleanup deletes.
 * Does NOT connect to Neon / production. Touches no product rows.
 */
@SpringBootTest
@ActiveProfiles("test")
class DemoOrderCleanupServiceTest {

    @Autowired
    private DemoOrderCleanupService cleanupService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    /** Prevent Excel / demo seeders from running against the test H2 DB. */
    @MockBean
    private DataSeeder dataSeeder;

    @MockBean
    private DemoUserSeeder demoUserSeeder;

    private Long demoOldOrderId;
    private Long demoRecentOrderId;
    private Long realUserOldOrderId;
    private Long itemAId;
    private Long itemBId;
    private Long itemCId;

    @BeforeEach
    void setUp() {
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();

        User demoUser = userRepository.save(new User("demo", "unused-hash", "demo@example.com"));
        User realUser = userRepository.save(new User("realuser", "unused-hash", "real@example.com"));

        // (a) demo + 60 minutes ago → SHOULD be deleted
        Order demoOld = new Order(demoUser, "Demo Old", "555", "Addr A", "Istanbul", "34000", 100.0);
        demoOld.setCreatedAt(LocalDateTime.now().minusMinutes(60));
        demoOld = orderRepository.save(demoOld);
        demoOldOrderId = demoOld.getId();
        itemAId = saveItem(demoOld, "Item-A", 1, 100.0).getId();

        // (b) demo + 10 minutes ago → must remain
        Order demoRecent = new Order(demoUser, "Demo Recent", "555", "Addr B", "Istanbul", "34000", 50.0);
        demoRecent.setCreatedAt(LocalDateTime.now().minusMinutes(10));
        demoRecent = orderRepository.save(demoRecent);
        demoRecentOrderId = demoRecent.getId();
        itemBId = saveItem(demoRecent, "Item-B", 2, 25.0).getId();

        // (c) realuser + 60 minutes ago → must NEVER be deleted
        Order realOld = new Order(realUser, "Real Old", "555", "Addr C", "Ankara", "06000", 75.0);
        realOld.setCreatedAt(LocalDateTime.now().minusMinutes(60));
        realOld = orderRepository.save(realOld);
        realUserOldOrderId = realOld.getId();
        itemCId = saveItem(realOld, "Item-C", 1, 75.0).getId();
    }

    private OrderItem saveItem(Order order, String name, int qty, double price) {
        OrderItem item = new OrderItem(order, null, qty, price);
        item.setProductName(name);
        return orderItemRepository.save(item);
    }

    @Test
    void cleanup_deletesOnlyExpiredDemoOrder_andCascadesItsItemsOnly() {
        assertThat(orderRepository.count()).isEqualTo(3);
        assertThat(orderItemRepository.count()).isEqualTo(3);

        List<Long> deletedCandidates = cleanupService.cleanupExpiredDemoOrders();

        System.out.println("TEST RESULT deletedCandidates=" + deletedCandidates);
        System.out.println("  (a) demoOld id=" + demoOldOrderId + " expected DELETED");
        System.out.println("  (b) demoRecent id=" + demoRecentOrderId + " expected KEPT");
        System.out.println("  (c) realUserOld id=" + realUserOldOrderId + " expected KEPT");
        System.out.println("  order count=" + orderRepository.count() + " expected 2");
        System.out.println("  remaining item ids=" +
                orderItemRepository.findAll().stream().map(OrderItem::getId).toList());

        assertThat(deletedCandidates)
                .as("only expired demo order is a cleanup target")
                .containsExactly(demoOldOrderId);

        // (a) gone; (b)(c) remain; count = 2
        assertThat(orderRepository.findById(demoOldOrderId)).isEmpty();
        assertThat(orderRepository.findById(demoRecentOrderId)).isPresent();
        assertThat(orderRepository.findById(realUserOldOrderId)).isPresent();
        assertThat(orderRepository.count()).isEqualTo(2);

        // order_items: only (a)'s item removed
        assertThat(orderItemRepository.findById(itemAId))
                .as("(a) order_item must be cascaded away")
                .isEmpty();
        assertThat(orderItemRepository.findById(itemBId))
                .as("(b) order_item must remain")
                .isPresent();
        assertThat(orderItemRepository.findById(itemCId))
                .as("(c) order_item must remain")
                .isPresent();
        assertThat(orderItemRepository.count()).isEqualTo(2);

        Set<Long> remainingItemOrderIds = orderItemRepository.findAll().stream()
                .map(item -> item.getOrder().getId())
                .collect(Collectors.toSet());
        assertThat(remainingItemOrderIds)
                .containsExactlyInAnyOrder(demoRecentOrderId, realUserOldOrderId)
                .doesNotContain(demoOldOrderId);
    }
}
