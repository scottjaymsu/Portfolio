import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

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
    cursor.execute("SELECT DISTINCT iata_code FROM airports")
    codes = []
    for row in cursor.fetchall():
        codes.append(row[0])
    conn.close()
    return codes

#Insert (or update) flights based on the flight_id (THIS IS NOT THE TAIL NUMBER....)
def insert_flights(flights):
    conn = get_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO flights (flight_id, time, date, arrival_iata, departure_iata, airline, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
            time = VALUES(time), 
            date = VALUES(date), 
            arrival_iata = VALUES(arrival_iata), 
            departure_iata = VALUES(departure_iata), 
            airline = VALUES(airline), 
            status = VALUES(status)
    """
    cursor.executemany(query, flights)
    conn.commit()
    conn.close()
