const express = require('express');
const cluster = require("cluster");
const totalCPUs = require('os').cpus().length;
if (cluster.isMaster) {
    
  console.log(`Total Number of CPU Counts is ${totalCPUs}`);

  for (var i = 0; i < totalCPUs; i++) {
      cluster.fork();
  }
  cluster.on("online", worker => {
      console.log(`Worker Id is ${worker.id} and PID is ${worker.process.pid}`);
  });
  cluster.on("exit", worker => {
      console.log(`Worker Id ${worker.id} and PID is ${worker.process.pid} is offline`);
      console.log("Let's fork new worker!");
      cluster.fork();
  });
}
else {
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
  const {checkimage}= require('./middleware/fileupload')

  app.use(morgan('combined'));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
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
  })
  }
