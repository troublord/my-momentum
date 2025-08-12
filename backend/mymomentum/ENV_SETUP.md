# Spring Boot Configuration Properties Setup

## Overview

This project now uses Spring Boot's `@ConfigurationProperties` to read configuration values from YAML files. This approach is clean, type-safe, and follows Spring Boot best practices.

## How It Works

### 1. **Configuration Properties**

- Uses `@ConfigurationProperties` with `app` prefix
- Type-safe configuration binding
- No hardcoded values in Java classes

### 2. **Profile Resolution**

- **Default Profile**: `application.yml` (base configuration)
- **Local Profile**: `application-local.yml` (development overrides)
- **Production Profile**: Set via `spring.profiles.active=prod`

### 3. **File Structure**

```
mymomentum/
├── application.yml           # Base configuration (default values)
├── application-local.yml     # Local development overrides
├── AppConfig.java           # Configuration properties class
└── .gitignore               # Should include application-local.yml for security
```

## Setup Instructions

### **Step 1: Install Dependencies**

```bash
mvn clean install
```

### **Step 2: Configure Environment**

1. **Use `application-local.yml`** for local development
2. **Modify values in `application-local.yml`** as needed
3. **Never commit `application-local.yml`** to version control

### **Step 3: Run Application**

```bash
# Run with default profile (production-safe)
mvn spring-boot:run

# Run with local profile (development)
mvn spring-boot:run -Dspring.profiles.active=local
```

## Profile Configuration

### **Default Profile (`application.yml`)**

- Contains production-safe default values
- No sensitive information
- Safe to commit to version control

### **Local Profile (`application-local.yml`)**

- Contains development-specific values
- May contain sensitive information
- Should NOT be committed to version control

### **Running with Different Profiles**

```bash
# Default profile (production-safe)
mvn spring-boot:run

# Local profile (development)
mvn spring-boot:run -Dspring.profiles.active=local

# Production profile
mvn spring-boot:run -Dspring.profiles.active=prod
```

## Production Deployment

### **Option 1: System Environment Variables**

```bash
export DB_PASSWORD="secure-production-password"
export JWT_SECRET="super-secure-production-secret"
```

### **Option 2: Docker Environment File**

```bash
# docker-compose.yml
environment:
  - DB_PASSWORD=${DB_PASSWORD}
  - JWT_SECRET=${JWT_SECRET}
```

### **Option 3: Kubernetes Secrets**

```yaml
# deployment.yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: password
```

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use strong passwords** in production
3. **Rotate secrets** regularly
4. **Use different values** for different environments
5. **Monitor access** to environment variables

## Troubleshooting

### **Application Won't Start**

- Check if all required environment variables are set
- Verify `.env` file is in project root
- Check Maven dependencies are installed

### **Database Connection Issues**

- Verify database is running
- Check database credentials in `env.local`
- Ensure database exists and is accessible

### **JWT Issues**

- Verify `JWT_SECRET` is set
- Check `JWT_EXPIRATION_MINUTES` value
- Ensure secret is long enough (at least 32 characters)
