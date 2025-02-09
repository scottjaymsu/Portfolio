from src.database import get_iata_codes, insert_flights, get_mock_tail_numbers
from src.scraper import scrape_flights

#This is the main function. The iata_codes is all the codes of airports in our airport database so it has data
#that the API can request from. I update the index of which tail_number we're currently at so our mock data isn't
#weirdly out of place. Most airports should have distinct tail_numbers,  however we only have around 60 distinct
#ones so far so if the airport has more than 60 departing flights it will be duplicated.
def main():
    iata_codes = get_iata_codes()
    tail_numbers, total_airplanes = get_mock_tail_numbers()
    current_index = 0
    for iata_code in iata_codes:
        if iata_code[0]:
            total_flights, flights = scrape_flights(iata_code, tail_numbers, total_airplanes, current_index, 'departures')
            if flights:
                insert_flights(flights)
            current_index = total_flights
            total_flights, flights = scrape_flights(iata_code, tail_numbers, total_airplanes, current_index, 'arrivals')
            if flights:
                insert_flights(flights)
            current_index = total_flights

if __name__ == "__main__":
    main()
