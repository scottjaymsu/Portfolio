To use:

# ./run.sh
# (Make sure you are in the 'messaging' directory)
# IF YOU MAKE ANY CHANGES TO THE 'JUMPSTART-LATEST' DIRECTORY, RUN ./run.sh -b, THE -B FLAG WILL BUILD THE DIRECTORY

# The "messaging" directory handles all data messages from the FAA SWIM data stream. It makes use of an already existing java application called "jumpstart-latest" to accept the Java Messaging Service messages. Each message contains an XML string. The jumpstart-latest/src/main/java/com/harris/cinnato/outputs directory are where the java files who control what happens to each JMS message live. In that directory, we have created a file called "DatabaseOutput.java" The rest of the 'jumpstart-latest' app is left as it. The contains all of our code and logic for parsing the data and inputing it into our database. The database information is accepted as CLI flags, so output database information should be stored in the fdps.conf file, which will run the program with those flags. That file also stored the information for connection to the FAA SWIM data stream.

# PUT DATABASE CONNECTION INFORMATION IN messaging/fdps.conf

# Side note: If you are on WINDOWS you need to use a linux subsystem such as git bash or wsl to run the .sh script. Alternatively, you can just copy and paste the commands from that script to the command line
