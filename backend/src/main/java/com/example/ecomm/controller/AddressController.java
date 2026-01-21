package com.example.ecomm.controller;

import com.example.ecomm.model.Address;
import com.example.ecomm.model.User;
import com.example.ecomm.repository.AddressRepository;
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
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

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

    // Get all addresses for current user
    @GetMapping("/me")
    public List<Address> getMyAddresses() {
        User user = getCurrentUser();
        return addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
    }

    // Create new address
    @PostMapping
    public ResponseEntity<?> createAddress(@RequestBody AddressRequest request) {
        User user = getCurrentUser();

        Address address = new Address(
                user,
                request.getFullName(),
                request.getPhoneNumber(),
                request.getAddressLine(),
                request.getCity(),
                request.getPostalCode());
        address.setIsDefault(request.getIsDefault() != null && request.getIsDefault());
        address.setCreatedAt(LocalDateTime.now());

        // If this is set as default, unset other defaults
        if (address.getIsDefault()) {
            List<Address> existingAddresses = addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
            existingAddresses.forEach(addr -> {
                if (addr.getIsDefault()) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            });
        }

        Address savedAddress = addressRepository.save(address);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("address", savedAddress);
        return ResponseEntity.ok(response);
    }

    // Update existing address
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody AddressRequest request) {
        User user = getCurrentUser();

        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Address not found or access denied"));

        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setPostalCode(request.getPostalCode());

        // Handle default flag change
        if (request.getIsDefault() != null && request.getIsDefault() && !address.getIsDefault()) {
            // Unset other defaults
            List<Address> existingAddresses = addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
            existingAddresses.forEach(addr -> {
                if (addr.getIsDefault() && !addr.getId().equals(id)) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            });
            address.setIsDefault(true);
        }

        Address savedAddress = addressRepository.save(address);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("address", savedAddress);
        return ResponseEntity.ok(response);
    }

    // Delete address
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        User user = getCurrentUser();

        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Address not found or access denied"));

        addressRepository.delete(address);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Address deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Set address as default
    @PutMapping("/{id}/set-default")
    public ResponseEntity<?> setDefault(@PathVariable Long id) {
        User user = getCurrentUser();

        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Address not found or access denied"));

        // Unset other defaults
        List<Address> existingAddresses = addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
        existingAddresses.forEach(addr -> {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        });

        // Set this as default
        address.setIsDefault(true);
        Address savedAddress = addressRepository.save(address);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("address", savedAddress);
        return ResponseEntity.ok(response);
    }

    // DTO for address requests
    public static class AddressRequest {
        private String fullName;
        private String phoneNumber;
        private String addressLine;
        private String city;
        private String postalCode;
        private Boolean isDefault;

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
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

        public Boolean getIsDefault() {
            return isDefault;
        }

        public void setIsDefault(Boolean isDefault) {
            this.isDefault = isDefault;
        }
    }
}
