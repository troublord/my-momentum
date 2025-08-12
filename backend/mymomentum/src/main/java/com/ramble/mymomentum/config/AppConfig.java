package com.ramble.mymomentum.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    
    private Cors cors = new Cors();
    private Security security = new Security();
    private Google google = new Google();
    
    public static class Cors {
        private List<String> allowedOrigins;
        
        public List<String> getAllowedOrigins() {
            return allowedOrigins;
        }
        
        public void setAllowedOrigins(List<String> allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }
    }
    
    public static class Security {
        private Jwt jwt = new Jwt();
        
        public Jwt getJwt() {
            return jwt;
        }
        
        public void setJwt(Jwt jwt) {
            this.jwt = jwt;
        }
        
        public static class Jwt {
            private String secret;
            private int expirationMinutes;
            
            public String getSecret() {
                return secret;
            }
            
            public void setSecret(String secret) {
                this.secret = secret;
            }
            
            public int getExpirationMinutes() {
                return expirationMinutes;
            }
            
            public void setExpirationMinutes(int expirationMinutes) {
                this.expirationMinutes = expirationMinutes;
            }
        }
    }
    
    public static class Google {
        private Oauth oauth = new Oauth();
        
        public Oauth getOauth() {
            return oauth;
        }
        
        public void setOauth(Oauth oauth) {
            this.oauth = oauth;
        }
        
        public static class Oauth {
            private String clientId;
            
            public String getClientId() {
                return clientId;
            }
            
            public void setClientId(String clientId) {
                this.clientId = clientId;
            }
        }
    }
    
    public Cors getCors() {
        return cors;
    }
    
    public void setCors(Cors cors) {
        this.cors = cors;
    }
    
    public Security getSecurity() {
        return security;
    }
    
    public void setSecurity(Security security) {
        this.security = security;
    }
    
    public Google getGoogle() {
        return google;
    }
    
    public void setGoogle(Google google) {
        this.google = google;
    }
}
