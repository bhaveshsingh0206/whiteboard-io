const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
   description: {
      type: String,
   },
   code: {
      type: String,
   },
   input: {
      type: String,
   },
   output: {
      type: String,
   },
   teacher_id: {
      type: String,
   },
   date: {
      type: Date,
      default: Date.now,
   },
   studentId: {
      type: String,
   },
   classId: {
      type: String,
   },
   extension: {
      type: String,
   },
});

module.exports = mongoose.model('Post', postSchema);
