const express = require('express'),
   mongoose = require('mongoose'),
   localStrategy = require('passport-local'),
   passportLocalMongoose = require('passport-local-mongoose'),
   Class = require('./models/class'),
   Student = require('./models/students'),
   Teacher = require('./models/teachers'),
   csv = require('csv-parser'),
   fs = require('fs'),
   asyn = require('async');

// const createTeacher = (username, password, email, classes) => {
// 	var classes_array = []
// 	asyn.series([
// 		function findclasses(createTeacher) {
// 			console.log(classes)
// 			classes.forEach((clas,index)=>{
// 			 Class.findOne({year:clas.year,department:clas.department,batch_name:clas.batch_name}, (err, c)=>{
// 			if(!err) {
// 				// console.log(c._id.toString(), "Classes ")
// 				classes_array.push(c._id.toString())
// 				if (index==classes.length-1) {
// 					createTeacher()
// 				}
// 			} else {
// // 				Error
// 			}
// 			})
// 			})

// 		},
// 		function createTeacher() {
// 			const teacher = new Teacher({
// 				username: username,
// 				email: email,
// 				designation: 'Teacher',
// 				classes: classes_array
// 			});
// 			Teacher.register(teacher, password, (err, teacher) => {
// 				if (!err) {
// 					console.log(teacher);
// 					console.log('Teacher created successfully');
// 				} else {
// 					console.log(err);
// 				}
// 			})

// 		}
// 	],()=>{
// 		console.log("Everything executed")
// 	})

function createClasses() {
   console.log('Creating classes...');
   var clas = new Class({
      year: 'FE',
      department: 'EXTC',
      batch_name: 'H1',
   });
   clas.save();
   clas = new Class({
      year: 'FE',
      department: 'EXTC',
      batch_name: 'H2',
   });
   clas.save();
   clas = new Class({
      year: 'FE',
      department: 'EXTC',
      batch_name: 'H3',
   });
   clas.save();
   // clas = new Class({
   // 	year: 'SE',
   // 	department: 'IT',
   // 	batch_name: 'D1'
   // });
   // clas.save();
   // clas = new Class({
   // 	year: 'SE',
   // 	department: 'IT',
   // 	batch_name: 'D2'
   // });
   // clas.save();
   // clas = new Class({
   // 	year: 'SE',
   // 	department: 'IT',
   // 	batch_name: 'D3'
   // });
   // clas.save();
   // clas = new Class({
   // 	year: 'SE',
   // 	department: 'IT',
   // 	batch_name: 'D4'
   // });
   // clas.save();
   // clas = new Class({
   // 	year: 'TE',
   // 	department: 'IT',
   // 	batch_name: 'D1'
   // });
   // clas.save();
   // clas = new Class({
   // 	year: 'TE',
   // 	department: 'IT',
   // 	batch_name: 'D2'
   // });
   // clas.save();
   // clas = new Class({
   // 	year: 'TE',
   // 	department: 'IT',
   // 	batch_name: 'D3'
   // });
   // clas.save();
   // clas = new Class({
   // 	year: 'TE',
   // 	department: 'IT',
   // 	batch_name: 'D4'
   // });
   clas.save(() => {
      console.log('Saved');
   });
}

function registerStudent(fileName) {
   fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (row) => {
         let classid;
         console.log(row.year);
         Class.findOne(
            {
               batch_name: row.batch.toUpperCase(),
               year: row.year,
               department: row.department,
            },
            (err, clas) => {
               console.log(clas);
               if (!err) {
                  classid = clas._id.toString();
                  const newStudent = new Student({
                     username: row.username,
                     name: capitalize(row.name),
                     email: row.email,
                     classId: classid,
                     designation: 'Student',
                  });
                  Student.register(newStudent, 'init@123', (err, student) => {
                     if (!err) {
                        console.log(`${student.name} added successfully`);
                        Student.authenticate('student')(() => {
                           console.log('ok');
                        });
                     } else {
                        console.log(err);
                     }
                  });
               } else {
                  console.log('There was an error!');
               }
            }
         );
      })
      .on('end', () => {
         console.log('CSV file successfully processed');
      });
}

// To convert uppercase names in sheets and to take only first and last names
function capitalize(name) {
   const arr = name.trim().split(' ');
   let capitalizedName = '';

   if (arr.length >= 2) {
      const firstName = arr[0];
      const lastName = arr[arr.length - 1];
      console.log(firstName);
      capitalizedName =
         firstName[0].toUpperCase() +
         firstName.substring(1).toLowerCase() +
         ' ' +
         lastName[0].toUpperCase() +
         lastName.substring(1).toLowerCase();
   } else if (arr.length == 1) {
      const firstName = arr[0];
      if (firstName)
         capitalizedName =
            firstName[0].toUpperCase() + firstName.substring(1).toLowerCase();
   } else {
      // Error
   }
   return capitalizedName;
}

registerStudent('csv/feextc2.csv');

// // module.exports.createClasses = createClasses;
// //module.exports.createTeacher = createTeacher;
