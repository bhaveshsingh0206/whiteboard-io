const mongoose = require('mongoose');

const Notif = new mongoose.Schema({
   tousername: {
      type: String,
      required: true,
   },
   fromusername: {
      type: String,
   },
   code: {
      type: String,
   },
   comment: {
      type: String,
   },
   date: {
      type: Date,
      default: Date.now,
   },
   email: {
      type: String,
   },
});

module.exports = mongoose.model('Notif', Notif);
