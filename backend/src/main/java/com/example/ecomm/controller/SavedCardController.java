package com.example.ecomm.controller;

import com.example.ecomm.model.SavedCard;
import com.example.ecomm.model.User;
import com.example.ecomm.repository.SavedCardRepository;
import com.example.ecomm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-cards")
@CrossOrigin(origins = "*")
public class SavedCardController {

    @Autowired
    private SavedCardRepository savedCardRepository;

    @Autowired
    private UserRepository userRepository;

    // Get current authenticated user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get all saved cards for current user
    @GetMapping("/me")
    public List<SavedCard> getMySavedCards() {
        User user = getCurrentUser();
        return savedCardRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
    }

    // Create new saved card
    @PostMapping
    public ResponseEntity<?> createSavedCard(@RequestBody SavedCardRequest request) {
        User user = getCurrentUser();

        SavedCard savedCard = new SavedCard(
                user,
                request.getCardholderName(),
                request.getLast4(),
                request.getExpiryMonth(),
                request.getExpiryYear());
        savedCard.setCardBrand(request.getCardBrand());
        savedCard.setIsDefault(request.getIsDefault() != null && request.getIsDefault());
        savedCard.setCreatedAt(LocalDateTime.now());

        // If this is set as default, unset other defaults
        if (savedCard.getIsDefault()) {
            List<SavedCard> existingCards = savedCardRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
            existingCards.forEach(card -> {
                if (card.getIsDefault()) {
                    card.setIsDefault(false);
                    savedCardRepository.save(card);
                }
            });
        }

        SavedCard saved = savedCardRepository.save(savedCard);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("savedCard", saved);
        return ResponseEntity.ok(response);
    }

    // Update existing saved card
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSavedCard(@PathVariable Long id, @RequestBody SavedCardRequest request) {
        User user = getCurrentUser();

        SavedCard savedCard = savedCardRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Saved card not found or access denied"));

        savedCard.setCardholderName(request.getCardholderName());
        savedCard.setLast4(request.getLast4());
        savedCard.setExpiryMonth(request.getExpiryMonth());
        savedCard.setExpiryYear(request.getExpiryYear());
        savedCard.setCardBrand(request.getCardBrand());

        // Handle default flag change
        if (request.getIsDefault() != null && request.getIsDefault() && !savedCard.getIsDefault()) {
            // Unset other defaults
            List<SavedCard> existingCards = savedCardRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
            existingCards.forEach(card -> {
                if (card.getIsDefault() && !card.getId().equals(id)) {
                    card.setIsDefault(false);
                    savedCardRepository.save(card);
                }
            });
            savedCard.setIsDefault(true);
        }

        SavedCard updated = savedCardRepository.save(savedCard);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("savedCard", updated);
        return ResponseEntity.ok(response);
    }

    // Delete saved card
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavedCard(@PathVariable Long id) {
        User user = getCurrentUser();

        SavedCard savedCard = savedCardRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Saved card not found or access denied"));

        savedCardRepository.delete(savedCard);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Saved card deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Set saved card as default
    @PutMapping("/{id}/set-default")
    public ResponseEntity<?> setDefault(@PathVariable Long id) {
        User user = getCurrentUser();

        SavedCard savedCard = savedCardRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Saved card not found or access denied"));

        // Unset other defaults
        List<SavedCard> existingCards = savedCardRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
        existingCards.forEach(card -> {
            if (card.getIsDefault()) {
                card.setIsDefault(false);
                savedCardRepository.save(card);
            }
        });

        // Set this as default
        savedCard.setIsDefault(true);
        SavedCard updated = savedCardRepository.save(savedCard);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("savedCard", updated);
        return ResponseEntity.ok(response);
    }

    // DTO for saved card requests
    public static class SavedCardRequest {
        private String cardholderName;
        private String last4;
        private String expiryMonth;
        private String expiryYear;
        private String cardBrand;
        private Boolean isDefault;

        public String getCardholderName() {
            return cardholderName;
        }

        public void setCardholderName(String cardholderName) {
            this.cardholderName = cardholderName;
        }

        public String getLast4() {
            return last4;
        }

        public void setLast4(String last4) {
            this.last4 = last4;
        }

        public String getExpiryMonth() {
            return expiryMonth;
        }

        public void setExpiryMonth(String expiryMonth) {
            this.expiryMonth = expiryMonth;
        }

        public String getExpiryYear() {
            return expiryYear;
        }

        public void setExpiryYear(String expiryYear) {
            this.expiryYear = expiryYear;
        }

        public String getCardBrand() {
            return cardBrand;
        }

        public void setCardBrand(String cardBrand) {
            this.cardBrand = cardBrand;
        }

        public Boolean getIsDefault() {
            return isDefault;
        }

        public void setIsDefault(Boolean isDefault) {
            this.isDefault = isDefault;
        }
    }
}
