@echo off
setlocal enabledelayedexpansion

set BUILD=false

:parse_args
if "%1"=="" goto end_parse_args
if "%1"=="-b" set BUILD=true
shift
goto parse_args

:end_parse_args

if "%BUILD%"=="true" (
    echo BUILDING PROJECT
    cd jumpstart-latest

    echo CLEANING THE MVN PACKAGE
    mvn clean package

    echo REMOVING THE OLD JUMPSTART JAR
    del lib\jumpstart-jar-with-dependencies.jar

    echo MOVE NEW JAR TO LIB FOLDER
    move target\jumpstart-jar-with-dependencies.jar lib\jumpstart-jar-with-dependencies.jar

    cd ..

    echo BUILD DOCKER IMAGE
    docker build -t scds-jumpstart .
)


echo RUN DOCKER CONTAINER
docker run -it --rm --name scds-jumpstart-fdps-v -v "%cd%\fdps.conf:/app/application.conf" scds-jumpstart


endlocal
