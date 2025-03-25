const express = require('express');
const app = express();
const cors = require('cors');
const simulatorRoutes = require('./routes/simulatorRoutes');
const airportSummaryRoutes = require('./routes/airportSummaryRoutes');
const airportDataRoutes = require('./routes/airportDataRoutes');
const flightDataRoutes = require('./routes/flightDataRoutes');
const fboCapacityRoutes = require('./routes/fboCapacityRoutes');
const batchFileRoutes = require('./routes/batchFileRoutes');
const alertRoutes = require('./routes/alertRoutes');
const mapRoutes = require('./routes/mapRoutes');
const parkingPriorityRoutes = require('./routes/parkingpriorityRoutes');
const fboRoutes = require('./routes/fboRoutes');

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.use('/simulator', simulatorRoutes);
app.use('/airports', airportSummaryRoutes);
app.use('/airportData', airportDataRoutes);
app.use('/flightData', flightDataRoutes);
app.use('/fboinfo', fboCapacityRoutes);
app.use('/batch', batchFileRoutes);
app.use('/map', mapRoutes);
app.use('/alerts', alertRoutes);
app.use('/airportsPriority', parkingPriorityRoutes);
app.use('/airports/fbo', fboRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});