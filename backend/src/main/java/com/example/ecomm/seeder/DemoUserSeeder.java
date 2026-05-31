package com.example.ecomm.seeder;

import com.example.ecomm.model.User;
import com.example.ecomm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DemoUserSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> demoUserOpt = userRepository.findByUsername("demo");
        if (demoUserOpt.isEmpty()) {
            User demoUser = new User("demo", passwordEncoder.encode("demo"), "demo@example.com");
            demoUser.setFullName("Demo User");
            userRepository.save(demoUser);
            System.out.println("✅ Demo user 'demo' seeded successfully.");
        }
    }
}
