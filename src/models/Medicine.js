const mongoose = require('mongoose');

const medicine = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Patients: [{
    Patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patient',
    },
  }],
});

exports.medicine = mongoose.model('medicine', medicine);
