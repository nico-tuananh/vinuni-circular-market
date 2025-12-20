package com.vinuni.circularmarket.security;

import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.model.UserStatus;
import com.vinuni.circularmarket.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("DEBUG: CustomUserDetailsService.loadUserByUsername called for: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        System.out.println("DEBUG: User found: " + user.getEmail() + ", role: " + user.getRole() + ", status: " + user.getStatus());

        // Check if user is active
        if (user.getStatus() != UserStatus.active) {
            throw new UsernameNotFoundException("User account is not active: " + email);
        }

        return user;
    }
}