# syntax=docker/dockerfile:1

############################################
# Build stage: compile Spring Boot with Maven
############################################
FROM maven:3.9.7-eclipse-temurin-17 AS build

WORKDIR /app

# Leverage layer caching for dependencies
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy sources and build
COPY src ./src
RUN mvn -q -DskipTests clean package

############################################
# Runtime stage: lightweight JRE image
############################################
FROM eclipse-temurin:17-jre-jammy

ENV PORT=8080 \
    JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -Dfile.encoding=UTF-8"

WORKDIR /app

# Create non-root user
RUN useradd -u 10001 -m spring

# Copy built jar from builder and set permissions
# Copy only the repackaged Spring Boot jar (excludes *.jar.original)
COPY --from=build /app/target/*-SNAPSHOT.jar /app/app.jar
RUN chown -R spring:spring /app
USER spring

EXPOSE 8080

# Render sets $PORT; pass it to Spring via system property
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$PORT -jar /app/app.jar"]
