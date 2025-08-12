package com.ramble.mymomentum.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.ramble.mymomentum.user.User;
import com.ramble.mymomentum.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class GoogleAuthController {

    private final GoogleIdTokenVerifier verifier;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public GoogleAuthController(GoogleIdTokenVerifier verifier, UserRepository userRepository, JwtService jwtService) {
        this.verifier = verifier;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public record GoogleAuthRequest(String idToken) {}

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody GoogleAuthRequest request) {
        try {
            GoogleIdToken idToken = verifier.verify(request.idToken());
            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleSub = payload.getSubject();
            String email = (String) payload.get("email");
            String name = (String) payload.get("name");

            Optional<User> optional = userRepository.findByGoogleSub(googleSub);
            User user = optional.orElseGet(() -> {
                User u = new User();
                u.setGoogleSub(googleSub);
                return u;
            });
            user.setEmail(email);
            user.setName(name);
            user = userRepository.save(user);

            String token = jwtService.issue(user.getId(), user.getEmail());
            return ResponseEntity.ok(Map.of("accessToken", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}


