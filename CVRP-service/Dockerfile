
# 1. Build stage (Maven)
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml first (for caching dependencies)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the jar (skip tests for faster build)
RUN mvn clean package -DskipTests


# 2. Run stage (Lightweight JRE)
FROM eclipse-temurin:21-jre

# Needed for OR-Tools native libs
# RUN apk add --no-cache libstdc++ libgcc bash curl

WORKDIR /app

# Copy jar from build stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
