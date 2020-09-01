const express = require('express'),
   mongoose = require('mongoose'),
   localStrategy = require('passport-local'),
   passportLocalMongoose = require('passport-local-mongoose'),
   Class = require('../models/class'),
   Student = require('../models/students'),
   Teacher = require('../models/teachers'),
   csv = require('csv-parser'),
   fs = require('fs'),
   asyn = require('async');

// function createTeacher(username, name, email, password, classes) {
// 	try {
// 		console.log('Registering teacher...');
// 		let classArray = [];
// 		classes.forEach(className => {
// 			console.log('hereee');
// 			const classObj = Class.findOne(
// 				{
// 					year: className.year,
// 					department: className.department,
// 					batch_name: className.batch_name
// 				},
// 				(err, classObj) => {
// 					if (classObj) {
// 						classArray.push(classObj.id);
// 						console.log('here');
// 					} else console.log(`Class: ${className} not found`);
// 				}
// 			);
// 		});

// 		console.log(classArray);
// 		const teacher = {
// 			username,
// 			name,
// 			email,
// 			password,
// 			designation: 'Teacher',
// 			classes: classArray
// 		};

// 		// Register Teacher
// 		Teacher.register(teacher, password, (err, teacher) => {
// 			if (!err) {
// 				console.log(teacher);
// 				console.log(`${teacher.username} added successfully`);
// 			} else {
// 				console.log(err);
// 			}
// 		});

// 	} catch (err) {
// 		console.error(err);
// 	}
// }

const createTeacher = (username, name, email, password, classes) => {
   var classes_array = [];
   asyn.series(
      [
         function findclasses(createTeacher) {
            console.log(classes);
            classes.forEach((clas, index) => {
               Class.findOne(
                  {
                     year: clas.year,
                     department: clas.department,
                     batch_name: clas.batch_name,
                  },
                  (err, c) => {
                     if (!err) {
                        // console.log(c._id.toString(), "Classes ")
                        classes_array.push(c._id.toString());
                        if (index == classes.length - 1) {
                           createTeacher();
                        }
                     } else {
                        // 				Error
                     }
                  }
               );
            });
            console.log(classes_array);
         },
         function createTeacher() {
            const teacher = new Teacher({
               username: username,
               email: email,
               designation: 'Teacher',
               classes: classes_array,
            });
            Teacher.register(teacher, password, (err, teacher) => {
               if (!err) {
                  console.log(teacher);
                  console.log(`${teacher.username} added successfully`);
               } else {
                  console.log(err);
               }
            });
         },
      ],
      () => {
         console.log('Everything executed');
      }
   );
};

classes = [
   {
      year: 'TE',
      department: 'IT',
      batch_name: 'D1',
   },
   {
      year: 'TE',
      department: 'IT',
      batch_name: 'D2',
   },
];
createTeacher('nehakatre', 'Neha Katre', 'nehakatre@gmail.com', '1', classes);

module.exports = createTeacher;
