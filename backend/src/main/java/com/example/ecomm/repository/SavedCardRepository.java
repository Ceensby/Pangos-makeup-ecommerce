package com.example.ecomm.repository;

import com.example.ecomm.model.SavedCard;
import com.example.ecomm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedCardRepository extends JpaRepository<SavedCard, Long> {
    List<SavedCard> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);

    Optional<SavedCard> findByIdAndUser(Long id, User user);
}
