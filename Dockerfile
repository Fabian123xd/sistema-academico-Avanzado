FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY .mvn .mvn
COPY mvnw pom.xml ./
COPY src src
RUN bash mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/sistema-academico-*.jar app.jar
CMD ["sh", "-c", "exec java -jar app.jar --server.port=${PORT:-8082}"]
