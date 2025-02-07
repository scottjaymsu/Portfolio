import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

from timezonefinder import TimezoneFinder
import pytz

def scrape_flights(airport_info, flight_type='departures'):
    iata_code = airport_info[0]
    #Each airport can have multiple departures and arrivals. New requests have to be made to get access to more than just the first 25 or so flights
    #For loop through each page for the iata_code that is sent for both departures and arrivals.
    flights = []
    page_number = 0
    print(f"Scraping Airport: {iata_code} for {flight_type.capitalize()}")

    end = False
    while not end:

        ##BIG NOTE: THIS TIMESTAMP GENERATES EVERYTHING FOR THAT SPECIFIC DATE
        ##TO DO: WRITE CODE TO UPDATE THE TIMESTAMP FOR EACH DAY
        if flight_type == 'departures':
            url = f'https://www.avionio.com/en/airport/{iata_code}/{flight_type}?ts=1738886400000&page={page_number}'
        else:
            url = f'https://www.avionio.com/en/airport/{iata_code}/{flight_type}?ts=1738886400000&page={page_number}'

        response = requests.get(url)
        
        #If the iata_code sent is invalid, won't continue on and receive errors. If there are No flights left it will break the loop
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.select_one('table.tt')
        if not table:
            print(f"IATA Code Invalid: {iata_code}")
            break

        rows = table.select("tr")
        for row in rows:
            if row.text == "No flights":
                print(f"No flights found on page {page_number}, breaking the loop.")
                end = True
        if end:
            break

        #I was able to find a library that can direcctly convert timezones based on lat and long coordinates which luckily were in the airport table 
        tf = TimezoneFinder()

        latitude = airport_info[1]
        longitude = airport_info[2]
        timezone_str = tf.timezone_at(lng=longitude, lat=latitude)
        local_tz = pytz.timezone(timezone_str)
        
        rows = soup.select("tr.tt-row:not(.tt-child)")
        print(len(rows))
        for row in soup.select("tr.tt-row:not(.tt-child)"):
            time = row.select_one("td.tt-t").text.strip()
            date = row.select_one("td.tt-d").text.strip()
            flight_id = row.select_one("td.tt-f a").text.strip()
            airline = row.select_one("td.tt-al").text.strip()
            status = row.select_one("td.tt-s").text.strip()
            time = row.select_one("td.tt-t").text.strip()
            today = datetime.today().date()

            time_str = f"{today} {time}"
            local_time = datetime.strptime(time_str, '%Y-%m-%d %H:%M')


            local_time = local_tz.localize(local_time)
            standardized_time = local_time.astimezone(pytz.UTC)
            destination_iata = row.select_one("td.tt-i a").text.strip()

            #switch destination and iata_code based on if it's a departure or an arrival.
            if flight_type == 'departures':
                flights.append((flight_id, time, date, destination_iata, iata_code, airline, status, standardized_time, 'Departure'))
            else:
                flights.append((flight_id, time, date, iata_code, destination_iata, airline, status, standardized_time, 'Arrival'))

        page_number += 1
    return flights


