package com.harris.cinnato.outputs;

import com.typesafe.config.Config;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;

//Code extended from L3Harris Swim Jumpstart Database Output Class (https://github.com/L3Harris/swim-jumpstart/blob/master/src/main/java/com/l3harris/swim/outputs/database/PostgresOutput.java)
public class DatabaseOutput extends Output {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseOutput.class);

    private Connection connection;

    public DatabaseOutput(Config config) {
        super(config);
        Config mysqlConfig = config.getConfig("mysql");
        
        String uri = mysqlConfig.getString("uri");
        String user = mysqlConfig.getString("user");
        String password = mysqlConfig.getString("password");
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection tempConn = DriverManager.getConnection(
                    uri.substring(0, uri.lastIndexOf("/")), 
                    user,
                    password)) {
                
                String dbName = uri.substring(uri.lastIndexOf("/") + 1);
                Statement stmt = tempConn.createStatement();
                
                stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS `" + dbName + "`");
                logger.info("Database existence verified/created");
            }

            connection = DriverManager.getConnection(uri, user, password);
            logger.info("Successfully connected to database");

        } catch (ClassNotFoundException e) {
            logger.error("MySQL JDBC Driver not found", e);
            throw new RuntimeException("MySQL JDBC Driver not found", e);
        } catch (SQLException e) {
            logger.error("Database connection failed", e);
            throw new RuntimeException("Database connection failed", e);
        }
    }

    /*
     * Scraping the Flight Message;
     * Input: JSONObject encompassing everything between the <message> object
     * Output: JSONObject with four attributes: values for aircraftIdentifcation, departure, arrival and a fourth for exists
     * If aircraftIdentification is NULL or the flight does not end in 'QS' the exists value will be 0
     */
    public JSONObject scrapeFlightMessage(JSONObject single_message) {
        JSONObject flightInfo = new JSONObject();
        JSONObject flight = single_message.getJSONObject("flight");
        if (flight != null) {
            String aircraftIdentification = null;

            if (flight.has("flightIdentification") && flight.getJSONObject("flightIdentification").has("aircraftIdentification")) {
                aircraftIdentification = flight.getJSONObject("flightIdentification").getString("aircraftIdentification");
            }

            if (aircraftIdentification != null && aircraftIdentification.endsWith("QS")) {
                String departurePoint = null;
                if (flight.has("departure") && 
                    flight.getJSONObject("departure").has("departurePoint")) {
                    departurePoint = flight.getJSONObject("departure").getString("departurePoint");
                }

                String arrivalPoint = null;
                if (flight.has("arrival") && 
                    flight.getJSONObject("arrival").has("arrivalPoint")) {
                    arrivalPoint = flight.getJSONObject("arrival").getString("arrivalPoint");
                }

                flightInfo.put("aircraftIdentification", aircraftIdentification);
                flightInfo.put("departurePoint", departurePoint);
                flightInfo.put("arrivalPoint", arrivalPoint);
                flightInfo.put("exists", 1);

            } else {
                logger.info("Skipping flight: " + (aircraftIdentification != null ? aircraftIdentification : "Unknown") + " (does not end with 'QS').");
                flightInfo.put("exists", 0);
            }
        } else {
            logger.warn("No 'flight' object found in the message.");
            flightInfo.put("exists", 0);
        }
        return flightInfo;
    }

    /*
     * Insert the flight data into the database;
     * Input: JSONObject for the flightInfo to be inserted
     * Output: None
     */
    public void InsertFlightData(JSONObject flightInfo) {
        String aircraftIdentification = flightInfo.getString("aircraftIdentification");
        String departurePoint = flightInfo.getString("departurePoint");
        String arrivalPoint = flightInfo.getString("arrivalPoint");

        String sql = "INSERT INTO flight_messages (flightIdentification_aircraftId, departure_departurePoint, arrival_arrivalPoint) " +
            "VALUES (?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE " +
            "departure_departurePoint = VALUES(departure_departurePoint), " +
            "arrival_arrivalPoint = VALUES(arrival_arrivalPoint)";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, aircraftIdentification);
            ps.setString(2, departurePoint);
            ps.setString(3, arrivalPoint);
            ps.executeUpdate();
            logger.info("Inserted/Updated: Aircraft ID: " + aircraftIdentification + ", Departure: " + departurePoint + ", Arrival: " + arrivalPoint);
        } catch (SQLException e) {
            logger.error("Error while inserting/updating flight message", e);
        }
    }


    /*
     * Main function for grabbing the messages and parsing them.
     */
    @Override
    public void output(String message, String header) {
        JSONObject xmlJSONObj = XML.toJSONObject(message);

        try {
            //Sometimes there are multiple messages per JSON output, in that case it will be an array instance
            //If only one message, it will be an object instance
            Object messageObj = xmlJSONObj.getJSONObject("ns5:MessageCollection").get("message");
            if (messageObj instanceof JSONArray) {
                JSONArray messages = (JSONArray) messageObj;
                for(int i = 0; i < messages.length(); i++) {
                    JSONObject single_message = messages.getJSONObject(i);
                    JSONObject flightInfo = scrapeFlightMessage(single_message);
                    int exists = flightInfo.getInt("exists");
                    if(exists == 1) {
                        InsertFlightData(flightInfo);
                    }
                }
            }
            else if (messageObj instanceof JSONObject) {
                JSONObject messages = (JSONObject) messageObj;
                JSONObject flightInfo = scrapeFlightMessage(messages);
                int exists = flightInfo.getInt("exists");
                if(exists == 1) {
                    InsertFlightData(flightInfo);
                }
            }
        }
        catch (Exception e) {
            logger.error("Error processing message.", e);
            logger.error(message);
        }

    }
        
}
