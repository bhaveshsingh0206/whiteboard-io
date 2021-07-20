# DJ Whiteboard

## About

A Node.js/Express project for live teacher-student integrated session management using sockets, wherein the student can write, compile, run and post codes and the teacher can edit the codes live.

> NOTE: This application was a modification for deployment in the college.
>
> For more details on the original build, click the link below
>
> [github.com/whiteboard](https://github.com/bhaveshsingh0206/Whiteboard)

## Developers

-  Adnan Hakim [github.com/adnanhakim](https://github.com/adnanhakim)

   -  UI Designing, Frontend and Dashboard Backend

-  Ali Abbas Rizvi [github.com/rizvialiabbas](https://github.com/rizvialiabbas)

   -  Compiler, Notification and Practice Room

-  Arsh Shaikh [github.com/arshshaikh06](https://github.com/arshshaikh06)

   -  UI Designing, Frontend, Editor and Java Compiler

-  Bhavesh Singh [github.com/bhaveshsingh0206](https://github.com/bhaveshsingh0206)

   -  Sockets Handling and Backend

-  Rahil Desai [github.com/Rahildesai7](https://github.com/Rahildesai7)

   -  Schema and Backend

-  Hussain Sadriwala [github.com/hussainf46](https://github.com/hussainf46)

   -  Forgot Password Module

## Technology Stack

1. Frontend developed using vanilla HTML, CSS and JS
1. Backend developed using Node.js/Express
1. Data is stored in MongoDB Atlas
1. Live code interaction done using [socket.io](https://www.npmjs.com/package/socket.io)
1. User session management done using [passport.js](https://www.npmjs.com/package/passport)
1. C and Python compiler provided by [compilex](https://www.npmjs.com/package/compilex)
1. Java compiler provided by [HackerEarth](https://www.hackerearth.com/docs/wiki/developers/v3/)
1. Editor provided by [Ace](https://ace.c9.io/)
1. Developed using [goorm IDE](https://ide.goorm.io/)

## Features

-  Login

   -  Login id and password are provided manually for students as well as teachers
   -  Id for students will be their respective sap ids
   -  Id for teachers will be as per their choice
   -  Default password is `init@123`
   -  Once they log in, the passwords can be changed using forgot password feature

-  Dashboard

   -  Show details about both students and teachers
   -  Show statistics about no of posts of the day, total posts etc
   -  For teachers
      -  Show all posts by that teacher
      -  Query posts by respective batches
   -  For students
      -  Show all posts by their respective batches
   -  Students can download any code they require from the dashboard
   -  Teachers can delete their own posts
   -  Notification feature to send notifications from student to teacher, teacher to teacher and teacher to student

-  Create/Join a Room

   -  Teachers can create rooms of any of the 3 languages supported, namely `C`, `Java` or `Python`
   -  Teachers can assign a password to their rooms for added security
   -  Students can join the respective room using the password

-  Room

   -  Question can be added by the teacher which will be displayed to all the students in that room _live_
   -  Students will get an editor for the respective language of the room
   -  Students/Teachers can change their respective editor themes to light, dark or black
   -  Students can write their code and can run it on the application
   -  The code will be run on the server and needs no software installed on the desktop
   -  The teacher can view the code of any student at any time _live_
   -  The teacher can also edit the code of any student _live_ and it will stop the student from editing the code at the same time
   -  The student can see if the teacher is watching him/her, or if the teacher is editing his/her code
   -  The student can finish his/her code which will be checked by the teacher
   -  The student can also download his/her code in the correct format
   -  At the end of the session, the teacher can post the code of any student which will be visible to all students of that batch

-  Practice Room
   -  Similar to room, but doesn't require the need of a teacher to create a room
   -  Anyone can go and code at any time they want
   -  **Java is not supported in this room**

## MIT LICENSE

> Copyright (c) 2020 DJ Callback
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
