# 建置階段 - 使用官方 Maven 映像
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
# 重新命名成固定檔名，避免版本號問題
RUN mv /app/target/*.jar /app/target/app.jar

# 運行階段
FROM eclipse-temurin:17-jre-slim
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
# 只安裝 curl（健康檢查需要）
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]