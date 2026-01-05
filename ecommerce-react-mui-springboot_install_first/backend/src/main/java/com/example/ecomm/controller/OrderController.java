package com.example.ecomm.controller;

import com.example.ecomm.model.Order;
import com.example.ecomm.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("CONFIRMED");
        order.setCreatedAt(java.time.LocalDateTime.now());
        return orderRepository.save(order);
    }
}
