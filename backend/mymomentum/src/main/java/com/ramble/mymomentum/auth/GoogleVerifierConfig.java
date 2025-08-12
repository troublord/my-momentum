package com.ramble.mymomentum.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ramble.mymomentum.config.AppConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class GoogleVerifierConfig {

    private final AppConfig appConfig;

    public GoogleVerifierConfig(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    @Bean
    public GoogleIdTokenVerifier googleIdTokenVerifier() throws Exception {
        String clientId = appConfig.getGoogle().getOauth().getClientId();
        return new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance()
        )
                .setAudience(Collections.singletonList(clientId))
                .build();
    }
}


