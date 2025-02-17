FROM openjdk:11-jre

RUN mkdir -p /app/
WORKDIR /app

COPY ./jumpstart-latest/lib/jumpstart-jar-with-dependencies.jar .

CMD ["java", "-Dconfig.file=/app/application.conf", "-jar", "jumpstart-jar-with-dependencies.jar"]
