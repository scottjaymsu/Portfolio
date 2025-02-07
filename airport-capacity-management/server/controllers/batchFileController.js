const db = require('../models/db');

//Need to update this to match insertAirportData which I researched how to not have to specify columns
exports.insertBatchData = (req, res) => {
    const batchData = req.body; 
  
    const query = `INSERT INTO aircraft_metadata (ICAO_Code, FAA_Designator, Manufacturer, Model_FAA, Model_BADA, Physical_Class_Engine, Num_Engines, AAC, AAC_minimum, AAC_maximum, ADG, TDG, Approach_Speed_knot, Approach_Speed_minimum_knot, Approach_Speed_maximum_knot, 
    Wingspan_ft_without_winglets_sharklets, Wingspan_ft_with_winglets_sharklets, Length_ft, Tail_Height_at_OEW_ft, Wheelbase_ft, Cockpit_to_Main_Gear_ft, Main_Gear_Width_ft, 
    MTOW_lb, MALW_lb, Main_Gear_Config, ICAO_WTC, Parking_Area_ft2, Class, FAA_Weight, CWT, One_Half_Wake_Category, Two_Wake_Category_Appx_A, Two_Wake_Category_Appx_B, Rotor_Diameter_ft, SRS, LAHSO, FAA_Registry, Registration_Count, TMFS_Operations_FY24, Remarks, LastUpdate)
                VALUES ?`;
  
    const values = batchData.map(row => [row.ICAO_Code, row.FAA_Designator, row.Manufacturer, row.Model_FAA, row.Model_BADA,row.Physical_Class_Engine, row.Num_Engines, row.AAC, row.AAC_minimum, row.AAC_maximum, row.ADG, row.TDG, row.Approach_Speed_knot, 
        row.Approach_Speed_minimum_knot, row.Approach_Speed_maximum_knot, row.Wingspan_ft_without_winglets_sharklets, row.Wingspan_ft_with_winglets_sharklets, row.Length_ft,
      row.Tail_Height_at_OEW_ft, row.Wheelbase_ft, row.Cockpit_to_Main_Gear_ft, row.Main_Gear_Width_ft, row.MTOW_lb, row.MALW_lb, row.Main_Gear_Config, row.ICAO_WTC, row.Parking_Area_ft2, row.Class,
      row.FAA_Weight, row.CWT, row.One_Half_Wake_Category, row.Two_Wake_Category_Appx_A, row.Two_Wake_Category_Appx_B, row.Rotor_Diameter_ft, row.SRS, row.LAHSO, row.FAA_Registry, row.Registration_Count, row.TMFS_Operations_FY24, row.Remarks, row.LastUpdate]);
  
    db.query(query, [values], (err, results) => {
      if (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).json({ error: 'Unable to insert data' });
      }});};
  

//When a user inserts the specific csv file from: https://ourairports.com/data/ (free and open for the public to consume)
exports.insertAirportData = (req, res) => {
  const batchData = req.body; 
  const keys = Object.keys(batchData[0]);

  //We should determine how we best want to do this. We COULD just update rows based on the airport_id but at that point you're still
  //iterating and updating every row as you don't know what specifically has changed. So at this point I think just deleting the entire
  //table and readding it is the best action.
  const cleanQuery = "DELETE FROM airports;";
  db.query(cleanQuery, (err, results) => {
    if (err) {
      console.error('Error deleting from the table:', err);
      res.status(500).json({ error: 'Unable to delete data' });
      return
    }});

  const query = "INSERT INTO airports (" + keys.toString() + ") VALUES ?";

  //Is there an easier way to do this?
  // Object.values(batchData): Extracts all the objects within batchData
  // map(obj => Object.values(obj)): Extracts all the values from each object
  // Have to convert the value to null IF it's an empty string or MySQL will throw an error :(
  const values = batchData.map(obj => 
    Object.values(obj).map(value => (value === '' ? null : value))
  );
  
  db.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.status(500).json({ error: 'Unable to insert data' });
    }});

  }