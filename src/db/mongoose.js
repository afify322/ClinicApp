const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
  });
