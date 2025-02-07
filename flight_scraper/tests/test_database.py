import unittest
from src.database import get_iata_codes

#Just tests the iata codes function atm...
class TestDatabase(unittest.TestCase):
    def test_get_iata_codes(self):
        codes = get_iata_codes()
        self.assertIsInstance(codes, list)

if __name__ == "__main__":
    unittest.main()
