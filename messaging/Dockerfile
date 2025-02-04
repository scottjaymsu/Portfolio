FROM openjdk:11-jre

RUN mkdir -p /app/
WORKDIR /app

COPY ./jumpstart-latest .

CMD ["./bin/run", "-Dconfig.file=/app/application.conf"]