const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const book = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
  },
  cost: {
    type: Number,
  },

  notes: String,
  status: {
    type: String,
    default: 'pending',
  },

  name: String,
  date:{
    type:Date,
    required:true
  },
  type:{
    type:String,
    enum: ['urgent', 'normal'],
  }

}, { timestamps: true });

book.plugin(mongoose_delete);
module.exports = mongoose.model('booking', book);
