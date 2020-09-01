const mongoose = require('mongoose'),
   passportLocalMongoose = require('passport-local-mongoose'),
   Schema = mongoose.Schema;

var teacherSchema = new Schema({
   username: {
      type: String,
      unique: true,
   },
   name: {
      type: String,
   },
   password: {
      type: String,
   },
   email: {
      type: String,
      unique: true,
   },
   designation: {
      type: String,
   },
   classes: [String],
});

teacherSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Teacher', teacherSchema);
