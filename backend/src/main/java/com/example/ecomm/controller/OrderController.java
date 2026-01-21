package com.example.ecomm.controller;

import com.example.ecomm.model.Order;
import com.example.ecomm.model.User;
import com.example.ecomm.repository.OrderRepository;
import com.example.ecomm.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController

// Base URL for all order-related endpoints
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // Creates a new order
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        order.setCreatedAt(java.time.LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Returns orders for the authenticated user only
    @GetMapping("/me")
    public java.util.List<Order> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUser(user);
    }

    // Returns a single order by ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {

        // Find order by ID or throw error if not found
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
}
