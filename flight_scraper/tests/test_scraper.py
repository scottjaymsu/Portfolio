import unittest
from src.scraper import scrape_flights

#Test the scraper function, only two testcases atm...
class TestScraper(unittest.TestCase):
    def test_valid_ap(self):
        flights = scrape_flights("JFK")
        self.assertIsInstance(flights, list)
    
    def test_invalid_ap(self):
        flights = scrape_flights("INVALID")
        self.assertEqual(flights, [])

if __name__ == "__main__":
    unittest.main()
