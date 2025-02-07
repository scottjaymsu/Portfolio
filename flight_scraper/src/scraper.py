import requests
from bs4 import BeautifulSoup

#Parses the html returned from the API request and returns as an array
def scrape_flights(iata_code):
    url = f'https://www.avionio.com/widget/en/{iata_code}/departures?style=2'
    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')
    flights = []

    for row in soup.select("tr.tt-row"):
        time = row.select_one("td.tt-t").text.strip()
        date = row.select_one("td.tt-d").text.strip()
        destination_iata = row.select_one("td.tt-i a").text.strip()
        flight_id = row.select_one("td.tt-f a").text.strip()
        airline = row.select_one("td.tt-al").text.strip()
        status = row.select_one("td.tt-s").text.strip()
        flights.append((flight_id, time, date, destination_iata, iata_code, airline, status))

    return flights