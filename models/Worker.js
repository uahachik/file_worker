const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  user_name: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  age: {
    type: Number
  }
});

module.exports = Worker = mongoose.model('worker', WorkerSchema);
