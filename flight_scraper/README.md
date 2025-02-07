#https://ourairports.com/about.html -- free to use for any consumer

"""
Behind the fun and features, OurAirports exists primarily as a public good. When Australia forced the US government to shut down public access to its Digital Aeronautical Flight Information File (DAFIF) service in 2006, there was no longer a good source of global aviation data. 
OurAirports started in 2007 primarily to fill that gap: we encourage members to create and maintain data records for airports around the world, and they manage over 40,000 of them. Many web sites, smartphone apps, and other services rely on OurAirport's data, which is all in the Public Domain (no permission required)."""


For use:
- Create a  .env file in the flight_scraper directory, with following database information:
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
- cd into flight_scraper directory.
- Type this command: python -m src.main

# Note: I have not coded extensive tests for this quite yet. TODO!
- To run the tests cd into flight_scraper directory
- To run all tests: python -m unittest discover -s tests
- To run a specific test: python -m unittest tests.{specific_test}