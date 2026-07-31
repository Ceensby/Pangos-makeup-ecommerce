package com.example.ecomm.repository;

import com.example.ecomm.model.Order;
import com.example.ecomm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    // Demo cleanup only: MUST always be called with the demo user entity — never without a user filter
    List<Order> findByUserAndCreatedAtBefore(User user, LocalDateTime cutoff);
}
