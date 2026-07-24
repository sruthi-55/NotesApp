# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for caching dependencies)
COPY mvnw .
COPY pom.xml .
COPY .mvn .mvn

# Give execute permission to mvnw
RUN chmod +x mvnw

# Copy the rest of the backend source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port that Spring Boot will run on
EXPOSE 8080

# Tell Spring Boot to use the PORT environment variable from Render
ENV JAVA_OPTS=""

# Run the JAR file
CMD java $JAVA_OPTS -jar target/*.jar
