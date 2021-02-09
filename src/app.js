const express = require('express');

const app = express();
require('dotenv').config();
const bodyparser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const morgan = require('morgan');
const admin = require('./routes/admin');
const patient = require('./routes/patient');
const clerk = require('./routes/clerk');
const port = process.env.PORT || 3000;
const { auth } = require('./middleware/auth');
app.use(morgan('combined'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(compression());
app.use(cors());
app.use('/clerk', clerk);
app.use('/patient', patient);
app.use('/Admin', admin);
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message: error, data });
});

mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
  }).then((data) => {
  app.listen(port);
}).catch((err) => {
  console.log(err);
});
