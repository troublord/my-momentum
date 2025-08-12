package com.ramble.mymomentum.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class MeController {

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        Object principal = authentication != null ? authentication.getPrincipal() : null;
        Long userId = principal instanceof Long ? (Long) principal : null;
        return Map.of("userId", userId);
    }
}


