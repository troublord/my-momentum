# 使用 OpenJDK 17 作為基礎映像
FROM openjdk:17-jdk-slim

# 設定工作目錄
WORKDIR /app

# 複製 Maven 配置檔案
COPY pom.xml .
COPY src ./src

# 安裝 Maven
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 建置應用程式
RUN mvn clean package -DskipTests

# 暴露端口
EXPOSE 8080

# 設定健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 啟動應用程式
CMD ["java", "-jar", "target/mymomentum-1.0-SNAPSHOT.jar"]
