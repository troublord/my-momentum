package com.ramble.mymomentum.auth;

import com.ramble.mymomentum.user.User;
import com.ramble.mymomentum.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MeController {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public MeController(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        Object principal = authentication != null ? authentication.getPrincipal() : null;
        Long userId = principal instanceof Long ? (Long) principal : null;
        return Map.of("userId", userId);
    }

    @PostMapping("/token")
    public ResponseEntity<?> getToken(@RequestBody TokenRequest request) {
        try {
            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(request.email());

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found with email: " + request.email()));
            }

            User user = userOpt.get();
            String token = jwtService.issue(user.getId(), user.getEmail());
            
            return ResponseEntity.ok(Map.of(
                "accessToken", token,
                "userId", user.getId(),
                "email", user.getEmail(),
                "name", user.getName()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to generate token: " + e.getMessage()));
        }
    }

    public record TokenRequest(String email) {}
}


