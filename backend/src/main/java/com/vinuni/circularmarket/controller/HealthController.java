package com.vinuni.circularmarket.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010"})
public class HealthController {

    /**
     * Health check endpoint
     * @return ResponseEntity with health status
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "VinUni Circular Market API");
        return ResponseEntity.ok(response);
    }
}