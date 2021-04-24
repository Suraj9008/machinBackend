const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');
const router = require('./route/user')

// maddilware
app.use(cors());
app.use(express.json());

// route middleware
app.use('/api', router);

// Database Connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connection successfull'));


// listen port
app.listen(process.env.PORT || 3000);