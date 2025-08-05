package com.ramble.mymomentum.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/health")
    public String healthCheck() {
        return "MyMomentum application is running! Database connection should be working.";
    }
} 