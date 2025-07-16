const express = require('express');
const router = require('./routes/sweets_route');
const app = express();

app.use(express.json());
app.use('/api/sweets', router);
app.get('/', (req, res) => {
  res.send('Sweet shop is up and running...');
});

module.exports = app;
