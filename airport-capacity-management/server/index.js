const express = require('express')
const app = express()
const cors = require('cors');
const batchFileRoutes = require('./routes/batchFileRoutes');

const port = 5000

app.use(cors());
app.use(express.json({limit: '500kb'}));

app.use('/batch', batchFileRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})