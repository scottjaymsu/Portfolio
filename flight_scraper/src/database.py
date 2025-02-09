import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

#You need to have this table in your local database right now, I might add a function to automatically make the table if it's needed idk
"""
'flights', 'CREATE TABLE `flights` (\n  `flight_id` varchar(50) NOT NULL,\n  `departure_time` varchar(10) DEFAULT NULL,\n  `arrival_time` varchar(45) DEFAULT NULL,\n  `date` varchar(20) NOT NULL,\n  
`departure_iata` varchar(10) NOT NULL,\n  `arrival_iata` varchar(10) NOT NULL,\n  `airline` varchar(100) DEFAULT NULL,\n  `status` varchar(100) DEFAULT NULL,\n  `departure_standardized_time` datetime DEFAULT NULL,\n  
`arrival_standardized_time` datetime DEFAULT NULL,\n  PRIMARY KEY (`flight_id`,`date`,`departure_iata`,`arrival_iata`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'
"""


#Establish connection to the database (add credentials to the env file - currently using local database but will switch to aws at some point)
def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

#Getting all the distinct iata codes from the airports currently in our database
def get_iata_codes():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT iata_code, latitude_deg, longitude_deg FROM airports WHERE iso_country = 'US'")
    codes = []
    for row in cursor.fetchall():
        codes.append(row)
    conn.close()
    return codes

#Getting all the distinct tail numbers in our mock table
def get_mock_tail_numbers():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT tail_number FROM mock_netjets_fleet_data")
    tail_numbers = []
    for row in cursor.fetchall():
        tail_numbers.append(row)
    cursor.execute("SELECT COUNT(*) FROM mock_netjets_fleet_data")
    total_airplanes = cursor.fetchone()
    conn.close()
    return tail_numbers, total_airplanes

#Insert (or update) flights based on the flight_id (THIS IS NOT THE TAIL NUMBER....)
def insert_flights(flights):
    conn = get_connection()
    cursor = conn.cursor()

    for flight in flights:

        #I'm setting departure time and arrival time seperately, standardized for the local airport that it's arriving or departing from
        if flight[8] == 'Departure':
            query = """
                INSERT INTO flights (flight_id, departure_time, date, arrival_iata, departure_iata, airline, status, departure_standardized_time, tail_number)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    departure_time = VALUES(departure_time),
                    departure_standardized_time = VALUES(departure_standardized_time),
                    tail_number = VALUES(tail_number)
            """
            cursor.executemany(query, [(flight[0], flight[1], flight[2], flight[3], flight[4], flight[5], flight[6], flight[7], flight[9])])
        else:
            query = """
                INSERT INTO flights (flight_id, arrival_time, date, arrival_iata, departure_iata, airline, status, arrival_standardized_time)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE \
                    arrival_time = VALUES(arrival_time),
                    arrival_standardized_time = VALUES(arrival_standardized_time)
            """
            cursor.executemany(query, [(flight[0], flight[1], flight[2], flight[3], flight[4], flight[5], flight[6], flight[7])])

    conn.commit()
    conn.close()
