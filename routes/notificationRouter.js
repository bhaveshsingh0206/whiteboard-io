const express = require('express'),
   passport = require('passport'),
   router = express.Router(),
   localStrategy = require('passport-local'),
   passportLocalMongoose = require('passport-local-mongoose'),
   mongoose = require('mongoose'),
   bodyParser = require('body-parser'),
   Student = require('../models/students'),
   Class = require('../models/class'),
   Teacher = require('../models/teachers'),
   Notif = require('../models/notif'),
   methods = require('../methods/method'),
   flash = require('connect-flash'),
   CryptoJS = require('crypto-js'),
   jwt = require('jwt-simple');

router.use(flash());

//Post notification
router.post('/api/post', (req, res) => {
   if (isNaN(req.body.tousername)) {
      Teacher.findOne({ username: req.body.tousername }, function (err, user) {
         if (Boolean(user)) {
            const notif = new Notif({
               tousername: req.body.tousername,
               fromusername: req.body.fromusername,
               code: req.body.code,
               comment: req.body.comment,
               date: req.body.date,
               email: req.body.email,
            });
            notif.save(function (err) {
               if (!err) {
                  res.send({
                     status: true,
                  });
               } else {
                  res.send({
                     status: false,
                  });
               }
            });
         } else {
            console.log('user doesnt exist');
         }
      });
   } else {
      Student.findOne({ username: req.body.tousername }, function (err, user) {
         if (Boolean(user)) {
            const notif = new Notif({
               tousername: req.body.tousername,
               fromusername: req.body.fromusername,
               code: req.body.code,
               comment: req.body.comment,
               date: req.body.date,
               email: req.body.email,
            });
            notif.save(function (err) {
               if (!err) {
                  res.send({
                     status: true,
                  });
               } else {
                  res.send({
                     status: false,
                  });
               }
            });
         } else {
            console.log('user doesnt exist');
         }
      });
   }
});

//Get all notifications by username
router.get('/api/get/all/:username', async (req, res) => {
   try {
      const notifications = await Notif.find({
         tousername: req.params.username,
      }).sort({ date: -1 });
      res.status(200).json({ notifications: notifications });
   } catch (err) {
      res.status(400).json({ error: err });
   }
});

//Get specific notification
router.get('/api/get/specific/:notificationid', async (req, res) => {
   try {
      const notification = await Notif.findById(req.params.notificationid);
      res.status(200).json({ notification: notification });
   } catch (err) {
      res.status(400).json({ error: err });
   }
});

// Delete notification
router.delete('/api/dashboard/delete/:notificationid', async (req, res) => {
   const message = await Notif.findByIdAndDelete(
      req.params.notificationid
   ).then(() => 'Post deleted successfully');
   res.json({ message });
});

module.exports = router;
