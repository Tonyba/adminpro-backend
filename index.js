require('dotenv').config();

const express = require('express');
const app = express();
const { dbConnection } = require('./db/config');
const cors = require('cors');

dbConnection();

app.use(cors());

app.listen(3000, () => {
  console.log('server connected');
});
