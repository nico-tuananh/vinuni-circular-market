package com.vinuni.circularmarket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.vinuni.circularmarket.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    // Database configuration will be handled by application.properties
    // and Spring Boot auto-configuration
}