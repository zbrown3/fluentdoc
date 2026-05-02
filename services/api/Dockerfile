FROM ubuntu:latest
LABEL authors="patrickgaston"

# Use Java 17 base image
# Build the jar file
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /opt/app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY ./src ./src
RUN ./mvnw clean install -DskipTests

# Use Java 17 base image for the final image
# Copy the jar file to the final image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /opt/app
# Expose the application port
# 8443 is the default port for HTTPS
EXPOSE 8443
COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
ENTRYPOINT ["java", "-jar", "/opt/app/*.jar" ]
