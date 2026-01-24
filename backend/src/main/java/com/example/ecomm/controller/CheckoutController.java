package com.example.ecomm.controller;

import com.example.ecomm.model.Order;
import com.example.ecomm.model.Payment;
import com.example.ecomm.model.User;
import com.example.ecomm.repository.OrderRepository;
import com.example.ecomm.repository.PaymentRepository;
import com.example.ecomm.repository.UserRepository;
import com.example.ecomm.repository.OrderItemRepository;
import com.example.ecomm.repository.ProductRepository;
import com.example.ecomm.model.OrderItem;
import com.example.ecomm.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "*")
public class CheckoutController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // DTO for checkout completion request
    public static class CheckoutRequest {
        // User info
        private String customerName;
        private String phoneNumber;

        // Address info
        private String addressLine;
        private String city;
        private String postalCode;

        // Payment info
        private String cardholderName;
        private String cardNumber;
        private String expiryDate;
        private String cvv;

        // Order info
        private Double amount;
        private java.util.List<OrderItemDTO> items;

        // Getters and setters
        public String getCustomerName() {
            return customerName;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
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

        public String getCardholderName() {
            return cardholderName;
        }

        public void setCardholderName(String cardholderName) {
            this.cardholderName = cardholderName;
        }

        public String getCardNumber() {
            return cardNumber;
        }

        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        public String getExpiryDate() {
            return expiryDate;
        }

        public void setExpiryDate(String expiryDate) {
            this.expiryDate = expiryDate;
        }

        public String getCvv() {
            return cvv;
        }

        public void setCvv(String cvv) {
            this.cvv = cvv;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public java.util.List<OrderItemDTO> getItems() {
            return items;
        }

        public void setItems(java.util.List<OrderItemDTO> items) {
            this.items = items;
        }
    }

    // DTO for individual order items in checkout request
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
        private Double price;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }
    }

    // Complete checkout - creates order and payment atomically
    @PostMapping("/complete")
    @Transactional
    public Map<String, Object> completeCheckout(@RequestBody CheckoutRequest request) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate required fields
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new RuntimeException("Invalid order amount");
        }

        // Create order
        Order order = new Order(
                user,
                request.getCustomerName(),
                request.getPhoneNumber(),
                request.getAddressLine(),
                request.getCity(),
                request.getPostalCode(),
                request.getAmount());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        // Mock payment processing - extract last 4 digits of card
        String last4 = request.getCardNumber() != null && request.getCardNumber().length() >= 4
                ? request.getCardNumber().substring(request.getCardNumber().length() - 4)
                : "0000";

        // Create payment record
        Payment payment = new Payment(
                savedOrder.getId(),
                request.getAmount(),
                request.getCardholderName(),
                last4);
        payment.setStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        // Create order items from cart items
        System.out.println("🛒 DEBUG: Received items array: " + request.getItems());
        System.out
                .println("🛒 DEBUG: Items count: " + (request.getItems() != null ? request.getItems().size() : "null"));

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            System.out.println("✅ Creating " + request.getItems().size() + " order items...");
            for (OrderItemDTO itemDTO : request.getItems()) {
                System.out.println("   - Product ID: " + itemDTO.getProductId() + ", Qty: " + itemDTO.getQuantity()
                        + ", Price: " + itemDTO.getPrice());

                // Find the product
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElse(null);

                if (product == null) {
                    System.out.println("   ⚠️  WARNING: Product not found for ID: " + itemDTO.getProductId());
                }

                // Create order item
                OrderItem orderItem = new OrderItem(
                        savedOrder,
                        product,
                        itemDTO.getQuantity(),
                        itemDTO.getPrice());
                OrderItem savedItem = orderItemRepository.save(orderItem);
                System.out.println("   ✅ Saved OrderItem ID: " + savedItem.getId());
            }
            System.out.println("✅ All order items created successfully!");
        } else {
            System.out.println("⚠️  WARNING: No items in request! OrderItems will be empty!");
        }

        // Update order status to PAID
        savedOrder.setStatus("PAID");
        orderRepository.save(savedOrder);

        // Return success response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("orderId", savedOrder.getId());
        response.put("message", "Order placed successfully");

        return response;
    }
}
