const mongoose = require('mongoose'),
   passportLocalMongoose = require('passport-local-mongoose'),
   Schema = mongoose.Schema;

var studentSchema = new Schema({
   username: {
      type: String,
      unique: true,
   }, // SAP Id
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
   classId: {
      type: String,
   },
   designation: {
      type: String,
   },
});

studentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Student', studentSchema);
