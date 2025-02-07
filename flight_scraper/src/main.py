from src.database import get_iata_codes, insert_flights
from src.scraper import scrape_flights

#This is the main function. The iata_codes is all the codes of airports in our airport database so it has data
#that the API can request from. 
def main():
    iata_codes = get_iata_codes()
    
    for iata_code in iata_codes:
        flights = scrape_flights(iata_code)
        if flights:
            insert_flights(flights)

if __name__ == "__main__":
    main()
