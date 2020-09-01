const express = require('express'),
   router = express.Router(),
   mongoose = require('mongoose'),
   bodyParser = require('body-parser'),
   Student = require('../models/students'),
   Class = require('../models/class'),
   Teacher = require('../models/teachers');

router.post('/teacher', async (req, res) => {
   const { username, name, email, password, classes } = req.body;
   try {
      console.log('Registering teacher...');
      let classArray = [];
      for (let i = 0; i < classes.length; i++) {
         console.log(
            classes[i].year,
            classes[i].department,
            classes[i].batch_name
         );
         const classObj = await Class.findOne({
            year: classes[i].year,
            department: classes[i].department,
            batch_name: classes[i].batch_name,
         });

         if (classObj) {
            classArray.push(classObj.id);
            console.log(classObj.id);
         } else console.log(`Class: ${classes[i]} not found`);
      }

      const teacher = {
         username,
         name,
         email,
         password,
         designation: 'Teacher',
         classes: classArray,
      };

      // Register Teacher
      Teacher.register(teacher, password, (err, teacher) => {
         if (!err) {
            console.log(`${teacher.username} added successfully`);
            res.send(`${teacher.username} added successfully`);
         } else {
            res.send(err);
         }
      });
   } catch (err) {
      console.error(err.message);
      res.status(400).send(err.message);
   }
});

router.post('/classes', async (req, res) => {
   const { classes } = req.body;
   try {
      for (let i = 0; i < classes.length; i++) {
         const { year, department, batch_name } = classes[i];
         const classObj = new Class({
            year,
            department,
            batch_name,
         });
         await classObj.save();
      }
      res.send('Classes added');
   } catch (err) {
      console.error(err.message);
      res.status(400).send(err.message);
   }
});

module.exports = router;
