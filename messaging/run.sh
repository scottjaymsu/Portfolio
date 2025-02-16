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
fi

echo "BUILD DOCKER IMAGE"
docker build -t scds-jumpstart .

echo "RUN DOCKER CONTAINER"

#Need to change the command if it's on windows, not sure if this will work on mac so going to have someone test this...
#At the moment if running on windows you must be using a linux subsystem, git bash or wsl!! .sh doesn't work on command prompt idt
OS=$(uname -s)
if [[ "$OS" == "MINGW"* ]]; then
    winpty docker run -it --rm --name scds-jumpstart-fdps-v -v "$(pwd)/fdps.conf:/app/application.conf" scds-jumpstart
else
    docker run -it --rm --name scds-jumpstart-fdps-v -v "$(pwd)/fdps.conf:/app/application.conf" scds-jumpstart
fi