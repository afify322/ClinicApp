const mongoose = require('mongoose');

const test = new mongoose.Schema({
  name: String,
  Patients: [{
    Patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patient',
    },
  }],
}, { collection: 'tests' });

exports.test = mongoose.model('test', test);
