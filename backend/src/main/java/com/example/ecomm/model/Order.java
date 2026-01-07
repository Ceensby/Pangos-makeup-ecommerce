package com.example.ecomm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "items_order") // 'order' is a reserved keyword in SQL
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String email;
    private String address;
    private String creditCard; // Simplified for demo
    private String status;
    private Double amount; // Total order amount
    private LocalDateTime createdAt;

    public Order() {
    }

    public Order(String customerName, String email, String address, String creditCard) {
        this.customerName = customerName;
        this.email = email;
        this.address = address;
        this.creditCard = creditCard;
        this.status = "RECEIVED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String name) {
        this.customerName = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCreditCard() {
        return creditCard;
    }

    public void setCreditCard(String cc) {
        this.creditCard = cc;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
