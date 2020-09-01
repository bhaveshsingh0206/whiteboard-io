const mongoose = require('mongoose'),
   Schema = mongoose.Schema;

const classSchema = new Schema({
   year: {
      type: String,
   },
   department: {
      type: String,
   },
   batch_name: {
      type: String,
   },
});

module.exports = mongoose.model('Class', classSchema);
