package com.example.ecomm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "items_order") // 'order' is a reserved keyword in SQL
public class Order {
    @Id

    // // Auto-increment ID
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // New fields for user-scoped orders
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Order items - products purchased in this order
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    private String customerName;
    private String phoneNumber;

    // Detailed address fields
    private String addressLine;
    private String city;
    private String postalCode;

    // Old fields (kept for backward compatibility)
    @Deprecated
    private String email;
    @Deprecated
    private String address;
    // creditCard removed for security - payment details only in Payment table

    private String status;
    private Double amount; // Total order amount
    private LocalDateTime createdAt;

    public Order() {
    }

    // New constructor with user relationship
    public Order(User user, String customerName, String phoneNumber,
            String addressLine, String city, String postalCode, Double amount) {
        this.user = user;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.addressLine = addressLine;
        this.city = city;
        this.postalCode = postalCode;
        this.amount = amount;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    // Old constructor (deprecated, kept for backward compatibility)
    @Deprecated
    public Order(String customerName, String email, String address, String creditCard) {
        this.customerName = customerName;
        this.email = email;
        this.address = address;
        this.status = "RECEIVED";
        this.createdAt = LocalDateTime.now();
    }

    // GettersAndSetters

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    // Helper method to add an order item
    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }
}
