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

router.use(bodyParser.urlencoded({ extended: true }));
router.use(flash());

isLoggedIn = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   } else {
      return res.redirect('/login');
   }
};

router.get('/', (req, res) => {
   res.redirect('dashboard');
});

router.get('/login', (req, res) => {
   res.render('login');
});

router.post(
   '/login-student',
   passport.authenticate('student', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
   }),
   (req, res) => {}
);
router.post(
   '/login-teacher',
   passport.authenticate('teacher', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
   }),
   (req, res) => {}
);

router.get('/dashboard', isLoggedIn, (req, res) => {
   res.render('index');
});

router.post('/register', (req, res) => {
   // console.log(req.body);
   var class_id = '';
   Class.findOne(
      { year: req.body.class_name, batch_name: req.body.batch },
      (err, clas) => {
         console.log('Its here');
         if (err) {
            console.log(err);
         } else {
            // console.log(clas);
            console.log(clas._id.toString());
            class_id = clas._id.toString();
            if (req.body.password === req.body.confirm_password) {
               console.log(class_id);
               var newStudent = new Student({
                  username: req.body.sapid,
                  email: req.body.email,
                  designation: 'Student',
                  classId: class_id,
               });
               Student.register(
                  newStudent,
                  req.body.password,
                  async (err, user) => {
                     if (err) {
                        console.log(err);
                        res.redirect('/register');
                     } else {
                        Student.authenticate('student')(req, res, () => {
                           res.redirect('/dashboard');
                        });
                        res.redirect('/dashboard');
                     }
                  }
               );
            } else {
               // Confirm password is wrong
               console.log('Confirm password is wrong');
               res.redirect('/register');
            }
         }
      }
   );
});

router.get('/register', (req, res) => {
   res.render('signup');
});

router.get('/logout', (req, res) => {
   req.logout();
   req.flash('out', 'Successfully logged you out');
   res.redirect('/login');
});

// Dashboard APIs
router.get('/api/dashboard/class/:classid', async (req, res) => {
   try {
      const classObj = await Class.findById(req.params.classid);
      res.status(200).json({ class: classObj });
   } catch (err) {
      res.status(400).json({ err: err });
   }
});

// Dropdown for teachers
router.get('/api/dashboard/classes/:teacherid', async (req, res) => {
   try {
      const teacher = await Teacher.findById(req.params.teacherid);
      const classArray = [],
         idsArray = [];
      for (let i = 0; i < teacher.classes.length; i++) {
         const classObj = await Class.findById(teacher.classes[i]);
         const className = `${classObj.year}-${classObj.department} ${classObj.batch_name}`;
         classArray.push(className);
         idsArray.push(classObj.id);
      }
      res.status(200).json({ classes: classArray, ids: idsArray });
   } catch (err) {
      res.status(400).json({ err: err });
   }
});

//Notification code
router.post('/notif', (req, res) => {
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
});

router.post('/getforgetpasswordlink', (req, res) => {
   // To create a cipher
   /*let myCipher = methods.cipher('mySecretSalt');

	//Then cipher any text:
	cipher = myCipher(req.body.useremail); // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"*/

   var payload = {
      email: req.body.useremail,
      nbf: Date.now() / 1000,
      exp: Date.now() / 1000 + 10000,
   };

   var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';

   var token = jwt.encode(payload, secret);

   var mailOptions = {
      from: 'Callback',
      to: req.body.useremail,
      subject: 'Reset password',
      text:
         'Open this link to reset password  https://callback-vtzhu.run-us-west2.goorm.io/forgetpassword/' +
         token,
   };

   methods
      .sendMail(mailOptions)
      .then(function (info) {
         //flash msg
         res.redirect('/login');

         console.log('mail sent');
      })
      .catch(function (err) {
         console.log('Send mail error ' + err);
         var data = { msg: 'Something went wrong.', param: '', success: false };
         res.send(data);
      });

   //res.render('forgetpassword.ejs');
});

router.get('/forgetpassword/:useremail', (req, res) => {
   res.render('forgetpassword', {
      useremail: req.params.useremail,
   });
});

router.post('/forgetpassword/:useremail', (req, res) => {
   //To decipher, you need to create a decipher and use it:
   // --> 'the secret string'
   /*let myDecipher = methods.decipher('mySecretSalt');
	deciphera = myDecipher(req.params.useremail);
	console.log(deciphera);*/
   let decoded;
   let deciphera;
   var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
   deciphera = jwt.decode(req.params.useremail, secret);
   console.log(deciphera.exp);
   // console.log(Date.now());
   console.log(typeof deciphera.exp);
   if (deciphera.exp - Date.now() / 1000 < 0) {
      console.log('token expired');
   } else {
      console.log(deciphera.email);

      if (req.body.newpassword === req.body.confirmpassword) {
         Student.findOne({ email: deciphera.email }, (err, user) => {
            if (!user) {
               Teacher.findOne({ email: deciphera.email }, (err, user) => {
                  if (err) {
                     res.send('no user found');
                  } else {
                     user.setPassword(req.body.newpassword, () => {
                        user.save();
                        console.log('password reset successful');
                     });
                  }
               });
            } else {
               user.setPassword(req.body.newpassword, (err, pass) => {
                  if (err) {
                     console.log(err);
                  } else {
                     user.save();
                     res.redirect('/login');
                     console.log('password reset successful');
                  }
               });
            }
         });
      } else {
         console.log('Check your input');
      }
   }
});

router.post('/getuserdetails', (req, res) => {
   const username = req.body.username;
   console.log(req.body.username);
   Student.findOne({ username: username }, (err, user) => {
      if (!user) {
         Teacher.findOne({ username: username }, (err, user) => {
            if (!user) {
               res.status(404);
            } else {
               res.status(200).json({ user: user.email });
            }
         });
      } else {
         console.log(user);
         res.status(200).json({ user: user.email });
      }
   });
});

router.get('/name/:sap', async (req, res) => {
   try {
      const studentObj = await Student.findOne({ username: req.params.sap });
      res.status(200).json({ name: studentObj.name });
   } catch (err) {
      res.status(400).json({ error: err });
   }
});

//notif get
router.get('/notif/:username', async (req, res) => {
   try {
      const notifs = await Notif.find({
         tousername: req.params.username,
      }).sort({ date: -1 });
      res.status(200).json({ notifs: notifs });
   } catch (err) {
      res.status(400).json({ error: err });
   }
});

router.get('/practice', (req, res) => {
   let currUser = req.user ? req.user._id : '';
   console.log(currUser);
   res.render('code-room', { currentUser: currUser });
});
module.exports = router;
