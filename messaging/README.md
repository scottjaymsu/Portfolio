To use:

# Make sure you are in the messaging directory
# At the moment You need to have a local database set up, I haven't set up a database within the docker container up for this since I believe we will be using an AWS one.
# When you set your local MYSQL database up, put the correct configuration in the fdps.conf. Mine is in there right now, so you might have to change the schema name and other metadata
# Once your database is set up: Run this command: ./run.sh
# Let me know if any issues, it's hard for me to tell if there will be issues on mac when i am on a windows environment
# Side note: If you are on WINDOWS you need to use a linux subsystem such as git bash or wsl to run the .sh script. Alternatively, you can just copy and paste the commands from that script to the command line

# IF YOU MAKE ANY CHANGES TO THE 'JUMPSTART-LATEST' DIRECTORY, RUN ./run.sh -b THE -B FLAG WILL BUILD THE DIRECTORY