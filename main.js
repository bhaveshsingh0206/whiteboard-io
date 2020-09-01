const express = require('express'),
   mongoose = require('mongoose'),
   passport = require('passport'),
   localStrategy = require('passport-local'),
   passportLocalMongoose = require('passport-local-mongoose'),
   indexRouter = require('./routes/indexRouters'),
   notificationRouter = require('./routes/notificationRouter'),
   roomRouter = require('./routes/roomRouter'),
   postRouter = require('./routes/postRouter'),
   downloadRouter = require('./routes/downloadRouter'),
   Student = require('./models/students'),
   Teacher = require('./models/teachers'),
   bodyParser = require('body-parser'),
   Class = require('./models/class'),
   flash = require('connect-flash'),
   compiler = require('compilex'),
   Notif = require('./models/notif'),
   socketio = require('socket.io'),
   jwt = require('jwt-simple'),
   hackerEarth = require('hackerearth-node'),
   config = require('config'),
   connectDB = require('./config/db'),
   cors = require('cors');

const HACKER_EARTH_CLIENT_SECRET_KEY = config.get('hackerEarthClientSecret');

const app = express();
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());

const expressServer = app.listen(4000, () => console.log('Server is on!'));
const io = socketio(expressServer);

// MongoDB Atlas Connection
connectDB();

app.use(
   require('express-session')({
      secret: 'CALLBACK',
      resave: false,
      saveUninitialized: false,
   })
);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());
passport.use('student', new localStrategy(Student.authenticate()));
passport.use('teacher', new localStrategy(Teacher.authenticate()));
passport.serializeUser((user, done) => {
   done(null, user);
});

passport.deserializeUser((user, done) => {
   if (user != null) {
      done(null, user);
   }
});
app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.out = req.flash('out');
   res.locals.failureFlash = req.flash('failureFlash');
   res.locals.mail = req.flash('mail');
   res.locals.login = req.isAuthenticated();
   next();
});

app.use(
   cors({
      allowedHeaders: ['sessionId', 'Content-Type'],
      exposedHeaders: ['sessionId'],
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
   })
);

// Routers
app.use('/post', postRouter);
app.use('/notification', notificationRouter);
app.use('/download', downloadRouter);
app.use('/room', roomRouter.router);
app.use('/', indexRouter);
app.use('/register', require('./routes/registerRouter'));

var option = { stats: true };
compiler.init(option);

// Compilex & Hackerearth-node
// For C language
app.post('/compile/c', function (req, res) {
   console.log('entered here');
   var code = req.body.code;
   var input = req.body.input;
   // console.log(code);
   // console.log(input);
   // compiler.flush(function() {
   // 	console.log('All previous temporary files flushed !');
   // });
   if (input === '') {
      var envData = { OS: 'linux', cmd: 'gcc', options: { timeout: 1000 } };
      compiler.compileCPP(envData, code, function (data) {
         if (data.error) {
            res.send({
               output: data.error,
               status: false,
            });
         } else {
            output = data.output;
            res.send({
               output: output,
               status: true,
            });
         }
      });
   } else {
      var envData = { OS: 'linux', cmd: 'gcc', options: { timeout: 1000 } };
      compiler.compileCPPWithInput(envData, code, input, function (data) {
         if (data.error) {
            res.send({
               output: data.error,
               status: false,
            });
         } else {
            console.log(data.output);
            res.send({
               output: data.output,
               status: true,
            });
         }
      });
   }
});

// For Java language
app.post('/compile/java', function (req, res) {
   var code = req.body.code;
   var input = req.body.input;

   const hackerEarthy = new hackerEarth(HACKER_EARTH_CLIENT_SECRET_KEY, '');
   var config = {};
   config.time_limit = 1; //your time limit in integer
   config.memory_limit = 323244; //your memory limit in integer
   config.source = code; //your source code for which you want to use hackerEarth api
   config.input = input; //input against which you have to test your source code
   config.language = 'JAVA'; //language

   //compile your code & run
   hackerEarthy
      .compile(config)
      .then((result) => {
         console.log(result);
         const apiResult = JSON.parse(result);

         var compileStatus = apiResult.compile_status;
         if (compileStatus == 'OK') {
            hackerEarthy
               .run(config)
               .then((result) => {
                  console.log(result);
                  const apiResult = JSON.parse(result);
                  console.log('result', apiResult.run_status.output);
                  res.send({
                     output: apiResult.run_status.output,
                     status: true,
                  });
               })
               .catch((err) => {
                  res.send({
                     output: apiResult,
                     status: false,
                  });
               });
         } else {
            res.send({
               output: compileStatus,
               status: true,
            });
         }
      })
      .catch((err) => {
         res.send({
            output: 'Api Error',
            status: false,
         });
      });
});

// /For Python Language
app.post('/compile/py', function (req, res) {
   var code = req.body.code;
   var input = req.body.input;
   if (input === '') {
      var envData = { OS: 'linux', options: { timeout: 1000 } };
      compiler.compilePython(envData, code, function (data) {
         if (data.error) {
            res.send({
               output: data.error,
               status: false,
            });
         } else {
            console.log(data.output);
            res.send({
               output: data.output,
               status: true,
            });
         }
      });
   } else {
      var envData = { OS: 'linux', options: { timeout: 1000 } };
      compiler.compilePythonWithInput(envData, code, input, function (data) {
         if (data.error) {
            res.send({
               output: data.error,
               status: true,
            });
         } else {
            console.log(data.output);
            res.send({
               output: data.output,
               status: true,
            });
         }
      });
   }
});

var classes1 = [
   {
      year: 'TE',
      department: 'IT',
      batch_name: 'D1',
   },
   {
      year: 'TE',
      department: 'IT',
      batch_name: 'D3',
   },
];
var classes2 = [
   {
      year: 'TE',
      department: 'IT',
      batch_name: 'D1',
   },
   {
      year: 'SE',
      department: 'IT',
      batch_name: 'D1',
   },
];

io.on('connection', (socket) => {
   roomRouter.page2(io, socket);

   return io;
});
