# Building MyMomentum: A Complete Spring Boot Project Journey

## Introduction

In this article, I'll walk you through the complete process of building **MyMomentum** - a Spring Boot-based activity tracking application. This project demonstrates modern Java development practices, from initial setup to a fully functional REST API with database integration.

## Project Overview

**MyMomentum** is an activity tracking system that helps users:

- Create and manage personal activities
- Set weekly goals for each activity
- Track activity execution with timestamps
- Monitor progress and maintain momentum

## Technology Stack

- **Java 17** - Latest LTS version with modern features
- **Spring Boot 3.2.0** - Rapid application development framework
- **Spring Data JPA** - Database abstraction layer
- **PostgreSQL 16** - Robust relational database
- **Maven** - Dependency management and build tool
- **Docker** - Containerized database setup
- **Swagger/OpenAPI** - API documentation
- **Lombok** - Reduces boilerplate code

## Step 1: Project Initialization

### Creating the Maven Project Structure

We started by creating a standard Maven project structure:

```
mymomentum/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── ramble/
│   │   │           └── mymomentum/
│   │   └── resources/
│   └── test/
│       └── java/
└── README.md
```

### Why Java 17?

Java 17 was chosen because:

- **Spring Boot 3.x Requirement**: Spring Boot 3.0+ requires Java 17 or higher
- **LTS Support**: Java 17 is a Long Term Support release
- **Modern Features**: Pattern matching, sealed classes, enhanced performance
- **Jakarta EE 9+**: Required for Spring Boot 3.x compatibility

## Step 2: Maven Configuration (pom.xml)

The `pom.xml` file is the heart of our project configuration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.ramble</groupId>
    <artifactId>mymomentum</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Spring Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Springdoc OpenAPI (Swagger) -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Key Dependencies Explained:

1. **spring-boot-starter-web**: Provides embedded Tomcat server and Spring MVC
2. **spring-boot-starter-data-jpa**: JPA and Hibernate integration
3. **postgresql**: Database driver for PostgreSQL
4. **lombok**: Reduces boilerplate code with annotations
5. **springdoc-openapi-starter-webmvc-ui**: Swagger UI for API documentation

## Step 3: Application Configuration (application.yml)

The `application.yml` file configures our application behavior:

```yaml
spring:
  application:
    name: mymomentum

  datasource:
    url: jdbc:postgresql://localhost:5432/mymomentumdb
    username: mymomentum
    password: secret123
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    database-platform: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8080

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
    com.ramble.mymomentum: DEBUG

# OpenAPI/Swagger Configuration
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
  info:
    title: MyMomentum API
    description: Activity tracking and momentum management API
    version: 1.0.0
    contact:
      name: MyMomentum Team
```

### Configuration Highlights:

- **Database Connection**: PostgreSQL on localhost:5432
- **JPA Settings**: Auto-update schema, show SQL for debugging
- **Logging**: Detailed SQL logging for development
- **Swagger**: API documentation at `/swagger-ui.html`

## Step 4: Database Setup with Docker

We used Docker to set up PostgreSQL for development:

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:16
    container_name: mymomentum-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: mymomentum
      POSTGRES_PASSWORD: secret123
      POSTGRES_DB: mymomentumdb
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
```

**Benefits of Docker approach:**

- Consistent development environment
- Easy setup and teardown
- No local PostgreSQL installation required
- Isolated database instance

## Step 5: Core Application Class

The main Spring Boot application class:

```java
package com.ramble.mymomentum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyMomentumApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyMomentumApplication.class, args);
    }
}
```

This simple class bootstraps the entire Spring Boot application.

## Step 6: Data Model Design

### Entity Classes

We designed two main entities to represent our domain:

#### Activity Entity

```java
@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "UUID")
    private UUID userId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "goal_time")
    private Integer goalTime; // Weekly goal time in seconds

    @Column(name = "color")
    private String color;

    @Column(name = "icon")
    private String icon;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

#### ActivityRecord Entity

```java
@Entity
@Table(name = "activity_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityRecord {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "UUID")
    private UUID id;

    @Column(name = "user_id", columnDefinition = "UUID")
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "executed_at", nullable = false)
    private LocalDateTime executedAt;

    @Column(name = "duration", nullable = false)
    private Integer duration; // Duration in seconds

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private RecordSource source;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### Design Decisions:

1. **UUID Primary Keys**: Better for distributed systems and security
2. **User-based Design**: Each activity belongs to a user (preparation for multi-tenancy)
3. **Audit Fields**: `createdAt` for tracking creation time
4. **Flexible Goal System**: Weekly goals in seconds for precision
5. **Record Source Tracking**: Distinguish between live and manual entries

## Step 7: Data Transfer Objects (DTOs)

DTOs help separate API contracts from internal entities:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityRequest {
    private String name;
    private Integer goalTime; // Weekly goal time in seconds
    private String color;
    private String icon;
}
```

## Step 8: Repository Layer

Spring Data JPA repositories provide data access:

```java
@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    /**
     * Find all activities by user ID
     */
    List<Activity> findByUserId(UUID userId);

    /**
     * Check if activity exists by user ID and name
     */
    boolean existsByUserIdAndName(UUID userId, String name);
}
```

**Spring Data JPA Benefits:**

- Automatic query generation from method names
- Built-in CRUD operations
- Type-safe queries
- Minimal boilerplate code

## Step 9: Service Layer

The service layer contains business logic:

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;

    public Activity createActivity(UUID userId, CreateActivityRequest request) {
        log.info("Creating activity for user: {}, name: {}", userId, request.getName());

        // Check if activity with same name already exists for this user
        if (activityRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new IllegalArgumentException("Activity with name '" + request.getName() + "' already exists for this user");
        }

        // Create new activity
        Activity activity = new Activity();
        activity.setUserId(userId);
        activity.setName(request.getName());
        activity.setGoalTime(request.getGoalTime());
        activity.setColor(request.getColor());
        activity.setIcon(request.getIcon());

        Activity savedActivity = activityRepository.save(activity);
        log.info("Activity created successfully with ID: {}", savedActivity.getId());

        return savedActivity;
    }

    @Transactional(readOnly = true)
    public List<Activity> getActivitiesByUserId(UUID userId) {
        log.info("Fetching activities for user: {}", userId);

        List<Activity> activities = activityRepository.findByUserId(userId);
        log.info("Found {} activities for user: {}", activities.size(), userId);

        return activities;
    }
}
```

**Key Features:**

- **Transaction Management**: `@Transactional` ensures data consistency
- **Business Validation**: Prevents duplicate activity names per user
- **Comprehensive Logging**: Tracks all operations
- **Read-Only Transactions**: Optimized for read operations

## Step 10: Controller Layer

REST controllers expose the API:

```java
@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Activity Management", description = "APIs for managing user activities")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    @Operation(
        summary = "創建新活動",
        description = "為指定用戶創建新活動"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "活動創建成功",
            content = @Content(schema = @Schema(implementation = Activity.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - 活動名稱已存在"
        )
    })
    public ResponseEntity<Activity> createActivity(
            @Parameter(description = "用戶ID", example = "123e4567-e89b-12d3-a456-426614174000")
            @RequestParam UUID userId,
            @RequestBody CreateActivityRequest request) {

        log.info("Creating activity for user: {}", userId);
        Activity createdActivity = activityService.createActivity(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdActivity);
    }

    @GetMapping
    @Operation(
        summary = "獲取用戶的所有活動",
        description = "獲取指定用戶的所有活動"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "活動獲取成功",
            content = @Content(schema = @Schema(implementation = Activity.class))
        )
    })
    public ResponseEntity<List<Activity>> getActivities(
            @Parameter(description = "用戶ID", example = "123e4567-e89b-12d3-a456-426614174000")
            @RequestParam UUID userId) {

        log.info("Fetching activities for user: {}", userId);
        List<Activity> activities = activityService.getActivitiesByUserId(userId);
        return ResponseEntity.ok(activities);
    }
}
```

**API Design Features:**

- **RESTful Design**: Proper HTTP methods and status codes
- **Comprehensive Documentation**: Swagger annotations for each endpoint
- **Parameter Validation**: Clear parameter descriptions with examples
- **Response Mapping**: Proper HTTP status codes (201 for creation)

## Step 11: Running the Application

### 1. Start the Database

```bash
docker-compose up -d
```

### 2. Run the Application

```bash
mvn spring-boot:run
```

### 3. Test the API

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Documentation**: http://localhost:8080/api-docs

## Step 12: Testing the API

### Create an Activity

```bash
curl -X POST "http://localhost:8080/api/activities?userId=123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Exercise",
    "goalTime": 1800,
    "color": "#FF6B6B",
    "icon": "🏃‍♂️"
  }'
```

### Get User Activities

```bash
curl -X GET "http://localhost:8080/api/activities?userId=123e4567-e89b-12d3-a456-426614174000"
```

## Key Learnings and Best Practices

### 1. **Layered Architecture**

- **Controller**: Handles HTTP requests/responses
- **Service**: Contains business logic
- **Repository**: Data access layer
- **Entity**: Database model

### 2. **Spring Boot Benefits**

- **Auto-configuration**: Minimal configuration required
- **Embedded Server**: No external server setup needed
- **Starter Dependencies**: Easy dependency management
- **Actuator**: Built-in monitoring and health checks

### 3. **Database Design Principles**

- **UUID Primary Keys**: Better for distributed systems
- **Audit Fields**: Track creation and modification times
- **Proper Relationships**: Use JPA annotations for relationships
- **Indexing Strategy**: Consider query patterns for indexing

### 4. **API Design Best Practices**

- **RESTful URLs**: Use proper HTTP methods and status codes
- **Comprehensive Documentation**: Swagger annotations
- **Error Handling**: Proper HTTP status codes and error messages
- **Validation**: Input validation and business rule enforcement

### 5. **Development Workflow**

- **Docker for Database**: Consistent development environment
- **Logging**: Comprehensive logging for debugging
- **Configuration Management**: Environment-specific configurations
- **Version Control**: Proper Git workflow

## Next Steps

The current implementation provides a solid foundation. Future enhancements could include:

1. **Authentication & Authorization**: JWT-based user authentication
2. **Activity Records API**: Create and query activity execution records
3. **Statistics & Analytics**: Goal achievement tracking and reporting
4. **Real-time Features**: WebSocket integration for live tracking
5. **Mobile API**: Optimized endpoints for mobile applications
6. **Testing**: Unit and integration tests
7. **Deployment**: Docker containerization and CI/CD pipeline

## Conclusion

Building MyMomentum from scratch demonstrated the power and simplicity of Spring Boot 3.x with Java 17. The combination of modern Java features, Spring Boot's auto-configuration, and PostgreSQL provided a robust foundation for a scalable activity tracking application.

The project showcases:

- **Modern Java Development**: Java 17 features and best practices
- **Spring Boot Ecosystem**: Comprehensive framework for web applications
- **Database Integration**: JPA/Hibernate with PostgreSQL
- **API Design**: RESTful APIs with comprehensive documentation
- **Development Workflow**: Docker, Maven, and proper project structure

This foundation can be extended to build a full-featured activity tracking platform with user management, advanced analytics, and real-time features.

---

_This article demonstrates how to build a production-ready Spring Boot application from the ground up, following modern Java development practices and best practices for API design and database integration._
