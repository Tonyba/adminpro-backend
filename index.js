require('dotenv').config();
const path = require('path');

const express = require('express');
const app = express();
const { dbConnection } = require('./db/config');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const hospitalRoutes = require('./routes/hospital');
const medicRoutes = require('./routes/medic');
const allRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');

dbConnection();

// public

app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/login', authRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/medic', medicRoutes);
app.use('/api/all', allRoutes);
app.use('/api/upload', uploadRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server connected');
});
