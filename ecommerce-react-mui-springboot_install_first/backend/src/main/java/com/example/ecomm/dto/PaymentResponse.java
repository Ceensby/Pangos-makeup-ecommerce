package com.example.ecomm.dto;

import java.time.LocalDateTime;

public class PaymentResponse {
    private Long paymentId;
    private Long orderId;
    private String status;
    private Double amount;
    private LocalDateTime paidAt;

    public PaymentResponse() {
    }

    public PaymentResponse(Long paymentId, Long orderId, String status, Double amount, LocalDateTime paidAt) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.status = status;
        this.amount = amount;
        this.paidAt = paidAt;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
}
