#[Data straight from the FAA](https://www.faa.gov/airports/engineering/aircraft_char_database)

For use (same as flight_scraper):
- Create a  .env file in the flight_metadata_scraper directory, with following database information:
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
- cd into flight_metadata_scraper directory.
- Type this command: python -m src.main
