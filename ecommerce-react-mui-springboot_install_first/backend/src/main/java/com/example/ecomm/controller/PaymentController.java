package com.example.ecomm.controller;

import com.example.ecomm.dto.PaymentRequest;
import com.example.ecomm.dto.PaymentResponse;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.Payment;
import com.example.ecomm.repository.OrderRepository;
import com.example.ecomm.repository.PaymentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentController(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public PaymentResponse processPayment(@RequestBody PaymentRequest request) {
        // Validate order exists
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));

        // Check if already paid
        if ("PAID".equals(order.getStatus())) {
            throw new RuntimeException("Order already paid");
        }

        // Extract last 4 digits (never store full card number)
        String last4 = request.getCardNumber().length() >= 4
                ? request.getCardNumber().substring(request.getCardNumber().length() - 4)
                : request.getCardNumber();

        // Create payment record (simulating payment processing)
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setCardholderName(request.getCardholderName());
        payment.setLast4(last4);
        payment.setStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        // Update order status
        order.setStatus("PAID");
        orderRepository.save(order);

        return new PaymentResponse(
                savedPayment.getId(),
                savedPayment.getOrderId(),
                savedPayment.getStatus(),
                savedPayment.getAmount(),
                savedPayment.getPaidAt());
    }

    @GetMapping("/order/{orderId}")
    public PaymentResponse getPaymentByOrderId(@PathVariable Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));

        return new PaymentResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getPaidAt());
    }
}
