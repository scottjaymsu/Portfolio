#!/bin/bash

BUILD=false

while getopts "b" flag; do
    case ${flag} in
        b) BUILD=true ;;
        *) echo "Usage: $0 [-b]"; 
        exit 1 ;;
    esac
done

if [ "$BUILD" = true ]; then
    echo "BUILDING PROJECT"
    cd jumpstart-latest/

    echo "CLEANING THE MVN PACKAGE"
    mvn clean package

    echo "REMOVING THE OLD JUMPSTART JAR"
    rm lib/jumpstart-jar-with-dependencies.jar

    echo "MOVE NEW JAR TO LIB FOLDER"
    mv target/jumpstart-jar-with-dependencies.jar lib/jumpstart-jar-with-dependencies.jar

    cd ..

    echo "BUILD DOCKER IMAGE"
    docker build --platform linux/amd64 -t username486/netjets_server:latest .
    # amd version so it can run on AWS amd servers
fi

echo "RUN DOCKER CONTAINER"

docker run -it --rm --name flight_data_scraper-fdps-v -v "$(pwd)/fdps.conf:/app/application.conf" username486/netjets_server:latest