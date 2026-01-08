package com.example.ecomm.controller;

import com.example.ecomm.model.Order;
import com.example.ecomm.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

@RestController

// Base URL for all order-related endpoints
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Creates a new order
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        order.setCreatedAt(java.time.LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Returns all orders
    @GetMapping
    public java.util.List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Returns a single order by ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {

        // Find order by ID or throw error if not found
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
}
