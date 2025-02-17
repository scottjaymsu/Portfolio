const express = require('express');
const app = express();
const cors = require('cors');
const simulatorRoutes = require('./routes/simulatorRoutes');
const airportSummaryRoutes = require('./routes/airportSummaryRoutes');

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.use('/simulator', simulatorRoutes);
app.use('/airports', airportSummaryRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});