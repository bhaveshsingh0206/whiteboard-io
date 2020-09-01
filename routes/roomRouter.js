const express = require('express'),
   router = express.Router();

const rooms = [];
router.get('/', isLoggedIn, (req, res) => {
   res.render('room');
});

router.post('/join', isLoggedIn, (req, res) => {
   let student = {
      username: req.user.username,
      isActive: true,
      didComplete: false,
      studentId: req.body.studentId,
      classId: req.body.classId,
   };
   rooms.forEach((room) => {
      if (room.roomId === req.body.roomId) {
         room.students.push(student);
      }
   });
   // console.log(rooms);
   res.send(true);
});

router.post('/create', isLoggedIn, (req, res) => {
   var room = {
      roomId: req.body.roomId,
      roomName: req.body.roomName,
      username: req.user.username,
      password: req.body.password,
      language: req.body.language,
      students: [],
   };
   rooms.push(room);
   res.send(true);
});
router.get('/all', (req, res) => {
   res.send({
      rooms: rooms,
   });
});

router.get('/:roomId', isLoggedIn, (req, res) => {
   let selectedRoom;
   rooms.forEach((room) => {
      if (room.roomId === req.params.roomId) {
         selectedRoom = room;
      }
   });
   // console.log('RooooomId')
   // console.log(selectedRoom)
   if (selectedRoom) {
      if (req.user.designation === 'Teacher') {
         res.render('teacher-room', {
            selectedRoom: selectedRoom,
            currentUser: req.user,
         });
      } else {
         // console.log("user" ,req.user._id.toString())
         res.render('student-room', {
            selectedRoom: selectedRoom,
            currentUser: req.user,
            studentId: req.user._id.toString(),
         });
      }
   } else {
      res.render('error');
      // 		No url page found
   }
});

router.get('/practice', isLoggedIn, (req, res) => {
   res.render('code-room');
});

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   } else {
      return res.redirect('/login');
   }
}

const socket_rooms = [];

module.exports.page2 = (io, socket) => {
   socket.on('get-rooms', (data) => {
      socket.emit('send-rooms', {
         rooms: rooms,
      });
   });
   socket.on('disconnect-user', (data) => {
      let teacher_socketID;
      if (data.designation == 'Student') {
         socket_rooms.forEach((room) => {
            if (room.roomId == data.roomId) {
               teacher_socketID = room.socketID;
            }
         });
         socket.broadcast
            .to(teacher_socketID)
            .emit('remove-the-editor', { username: data.username });
         // console.log('Student disconnected')
         socket.disconnect();

         let removal_index;
         socket_rooms.forEach((room) => {
            if (room.roomId == data.roomId) {
               room.students.forEach((student, index) => {
                  if (student.username === data.username) {
                     removal_index = index;
                     // console.log('Student removed from socket_rooms');
                  }
               });
               room.students.splice(removal_index, 1);
            }
         });
         let i;
         rooms.forEach((room) => {
            if (room.roomId === data.roomId) {
               room.students.forEach((student, index) => {
                  if (student.username === data.username) {
                     i = index;
                     // console.log('Student removed from Rooms');
                  }
               });
               room.students.splice(i, 1);
            }
         });
         socket.emit('remove-the editor');
      } else {
         socket.to(data.roomId).emit('disconnect-all-user');
         socket.disconnect();
         // console.log('Teacher disconnected')
         let room_index;
         rooms.forEach((room, index) => {
            if (room.roomId == data.roomId) {
               room_index = index;
               // console.log('Room removed from Rooms')
            }
         });
         rooms.splice(room_index, 1);
         socket_rooms.forEach((room, index) => {
            if (room.roomId == data.roomId) {
               room_index = index;
               // console.log('Room removed from Socket ROoms')
            }
         });
         socket_rooms.splice(room_index, 1);
      }
   });
   socket.on('create-room', (data) => {
      let room = {
         socketID: socket.id,
         roomId: data.roomId,
         question: '',
         username: data.username,
         students: [],
      };
      socket.join(data.roomId);
      // socket_rooms.push(room);
      if (socket_rooms.length > 0) {
         socket_rooms.forEach((roo) => {
            if (roo.roomId === data.roomId) {
               // ROOM IS ALREADY CREATED
            } else {
               socket_rooms.push(room);
            }
         });
      } else {
         socket_rooms.push(room);
      }
      // console.log('____________________________________');
      // console.log('create-room')
      // console.log('____________________________________');
      // console.log('JOINED')
      // console.log('____________________________________')
      // console.log('Socket_room')
      // console.log(socket_rooms);
   });
   socket.on('join-room', (data) => {
      // console.log('join-room')
      socket.join(data.roomId);
      let student = {
         socketID: socket.id,
         username: data.username,
      };
      // console.log(data);
      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.push(student);
         }
      });
      let question;
      rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            question = room.question;
         }
      });
      // console.log('____________________________________');
      // console.log('JOINED')
      // console.log('____________________________________')
      // console.log('Socket_room')
      // console.log(socket_rooms);
      // console.log('ROom')
      // console.log(rooms);
      socket.emit('get-question', { question: question });
      // 		Left more to be coded
   });

   socket.on('get-students', (data) => {
      let students = [];
      rooms.forEach((room) => {
         if (room.roomId === data.roomId) {
            students = room.students;
         }
      });
      // console.log('send-student')
      // console.log(students)
      socket.emit('send-student', {
         students: students,
      });
   });

   socket.on('set-question', (data) => {
      rooms.forEach((room) => {
         if (room.roomId === data.roomId) {
            room.question = data.question;
         }
      });
      socket.to(data.roomId).emit('receive-question', {
         question: data.question,
      });
   });

   socket.on('get-code-from-student', (data) => {
      let student_socketID;
      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student) => {
               if (student.username === data.student_username) {
                  student_socketID = student.socketID;
                  console.log('Data is being requesting from student');
                  console.log(student.username);
               }
            });
         }
      });
      socket.to(data.roomId).emit('isActive');
      socket.broadcast.to(student_socketID).emit('teacher-requesting-code');
   });

   socket.on('acknowledge-with-code', (data) => {
      let teacher_socketID;
      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            teacher_socketID = room.socketID;
            // console.log('Data is being send to treacher')
            // console.log(room.username);
         }
      });

      socket.broadcast.to(teacher_socketID).emit('teacher-requesting-code', {
         code: data.code,
      });
   });
   socket.on('send-data-to-teacher', (data) => {
      let teacher_socketID;
      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            teacher_socketID = room.socketID;
         }
      });
      socket.broadcast.to(teacher_socketID).emit('teacher-requesting-code', {
         code: data.code,
      });
   });
   socket.on('transfer-teacher-data', (data) => {
      let student_socketID;
      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student) => {
               if (student.username === data.student_username) {
                  student_socketID = student.socketID;
               }
            });
         }
      });
      socket.broadcast.to(student_socketID).emit('teacher-changes', {
         code: data.code,
         cursorPosition: data.cursorPosition,
      });
   });

   socket.on('disenable-editable', (data) => {
      let student_socketID;
      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student) => {
               if (student.username === data.student_username) {
                  student_socketID = student.socketID;
               }
            });
         }
      });
      socket.broadcast.to(student_socketID).emit('disenable-editable', {
         code: data.code,
      });
   });
   socket.on('focus-lost', (data) => {
      // console.log('focus-lost')
      let teacher_socketID;
      let student_index;

      rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student, index) => {
               if (student.username === data.username) {
                  student_index = index;
               }
            });
            room.students[student_index].isActive = false;
         }
      });

      socket_rooms.forEach((room, index) => {
         if (room.roomId == data.roomId) {
            teacher_socketID = room.socketID;
            teacher_index = index;
         }
      });
      socket.broadcast.to(teacher_socketID).emit('teacher-focus-lost', {
         student_username: data.username,
      });
   });

   socket.on('focus-gain', (data) => {
      let teacher_socketID;
      let student_index;
      rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student, index) => {
               if (student.username === data.username) {
                  student_index = index;
               }
            });
            room.students[student_index].isActive = true;
         }
      });

      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            teacher_socketID = room.socketID;
         }
      });
      socket.broadcast.to(teacher_socketID).emit('teacher-focus-gain', {
         student_username: data.username,
      });
   });
   socket.on('student-requesting-check', (data) => {
      let student_index;
      rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student, index) => {
               if (student.username === data.username) {
                  student_index = index;
               }
            });
            room.students[student_index].didComplete = true;
         }
      });
   });
};

module.exports.router = router;
