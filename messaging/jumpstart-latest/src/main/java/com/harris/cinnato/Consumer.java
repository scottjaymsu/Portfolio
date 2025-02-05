/*
 * Copyright (c) 2021 L3Harris Technologies
 */
package com.harris.cinnato;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Slf4jReporter;
import com.harris.cinnato.outputs.Output;
import com.harris.cinnato.solace.AMQPConsumer;
import com.harris.cinnato.solace.JMSConsumer;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.TimeUnit;

/**
 * Main entry-point for starting the JMS Consumer given the configuration loaded @see com.typesafe.config.ConfigFactory.
 * Starts the metrics reporter and connects the JMS Consumer to the message broker.
 */
class Consumer {
    private static final Logger logger = LoggerFactory.getLogger(Consumer.class);
    private static final MetricRegistry metrics = new MetricRegistry();

    public static void main(String[] args) throws Exception {
        Output reporter = null;
        Config config = ConfigFactory.load();
        String reporterName = config.getString("output");

        logger.info("Attempting to load output class: {}", reporterName); // Log the reporterName to see what class is being loaded

        try {
            // Step 1: Load the class using reflection
            Class<?> clazz = Class.forName(reporterName);
            logger.info("Class {} loaded successfully", reporterName); // Log success after class is loaded
            
            // Step 2: Instantiate the class using the constructor that accepts Config
            Object obj = clazz.getConstructor(Config.class).newInstance(config);
            reporter = (Output) obj;
            logger.info("Output class {} instantiated successfully", reporterName); // Log success after instantiation

        } catch (ClassNotFoundException e) {
            logger.error("Class not found: {}", reporterName, e); // Log if the class itself was not found
            System.exit(-1);
        } catch (NoSuchMethodException e) {
            logger.error("No constructor with Config parameter found for class: {}", reporterName, e); // Log if no matching constructor is found
            System.exit(-1);
        } catch (InstantiationException e) {
            logger.error("Failed to instantiate class: {}", reporterName, e); // Log instantiation issues
            System.exit(-1);
        } catch (IllegalAccessException e) {
            logger.error("Illegal access when trying to instantiate class: {}", reporterName, e); // Log if there's an access issue
            System.exit(-1);
        } catch (InvocationTargetException e) {
            logger.error("Error invoking constructor for class: {}", reporterName, e); // Log if the constructor throws an exception
            System.exit(-1);
        } catch (Exception e) {
            logger.error("An unexpected error occurred while initializing the output class: {}", reporterName, e); // General catch for unexpected exceptions
            System.exit(-1);
        }



        if (config.getString("providerUrl").startsWith("amqp")) {
            AMQPConsumer consumer = new AMQPConsumer(config, metrics, reporter);
            consumer.connect();
        } else {
            JMSConsumer consumer = new JMSConsumer(config, metrics, reporter);
            consumer.connect();
        }

        if (config.getBoolean("metrics")) {
            startReporter();
        }

        while (true) {
            Thread.sleep(20000);
        }
    }

    /**
     * Starts metrics logging for message rate.
     * Sets the Logger where the metrics are logged.
     * Sets the rate at which the metrics are logged.
     */
    private static void startReporter() {
        final Slf4jReporter reporter = Slf4jReporter.forRegistry(metrics)
                .outputTo(LoggerFactory.getLogger("com.harris.cinnato"))
                .convertRatesTo(TimeUnit.SECONDS)
                .convertDurationsTo(TimeUnit.MILLISECONDS)
                .build();
        reporter.start(1, TimeUnit.SECONDS);
    }

}
