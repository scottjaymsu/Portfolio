Commands:
Run the following from the main directory:  docker build -t scds-jumpstart .
Run the following from the main directory (after first command): docker run –it --rm --name scds-jumpstart-fdps-v 
${PWD}/fdps.conf:/app/application.conf scds-jumpstart
NOTE: ${PWD} is a Linux command, if on windows you will need to print your working directory manually

