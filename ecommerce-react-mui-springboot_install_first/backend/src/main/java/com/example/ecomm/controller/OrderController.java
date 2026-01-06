package com.example.ecomm.controller;

import com.example.ecomm.model.Order;
import com.example.ecomm.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        order.setCreatedAt(java.time.LocalDateTime.now());
        return orderRepository.save(order);
    }

    @GetMapping
    public java.util.List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
}
