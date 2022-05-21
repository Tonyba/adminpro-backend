require('dotenv').config();

const express = require('express');
const app = express();
const { dbConnection } = require('./db/config');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

dbConnection();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/login', authRoutes);

app.listen(3000, () => {
  console.log('server connected');
});
