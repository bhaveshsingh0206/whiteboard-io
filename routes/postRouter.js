const express = require('express'),
   router = express.Router(),
   mongoose = require('mongoose'),
   Student = require('../models/students'),
   Class = require('../models/class'),
   Teacher = require('../models/teachers'),
   Post = require('../models/post'),
   Notif = require('../models/notif');

// Get all posts
router.get('/api/dashboard/:designation/:userid', async (req, res) => {
   try {
      if (req.params.designation == 'teacher') {
         const postsObj = await Post.find({
            teacher_id: req.params.userid,
         }).sort({ date: -1 });
         const posts = [];
         for (let postObj of postsObj) {
            let post = postObj.toObject();
            const teacherObj = await Teacher.findById(post.teacher_id);
            post.teacher = teacherObj.username;
            const studentObj = await Student.findById(post.studentId);
            post.student = studentObj.name;
            const classObj = await Class.findById(post.classId);
            post.class = `${classObj.year} - ${classObj.department} ${classObj.batch_name}`;
            posts.push(post);
         }
         res.status(200).json({ posts: posts });
      } else {
         const studentObj = await Student.findById(req.params.userid);
         const classObj = await Class.findById(studentObj.classId);
         const postsObj = await Post.find({ classId: classObj._id }).sort({
            date: -1,
         });
         const posts = [];
         for (let postObj of postsObj) {
            let post = postObj.toObject();
            const teacherObj = await Teacher.findById(post.teacher_id);
            post.teacher = teacherObj.username;
            const studentPostObj = await Student.findById(post.studentId);
            post.student = studentPostObj.name;
            post.class = `${classObj.year} - ${classObj.department} ${classObj.batch_name}`;
            posts.push(post);
         }
         res.status(200).json({ posts: posts });
      }
   } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
   }
});

// Filter posts by class id
router.get('/api/dashboard/filter/:classid', async (req, res) => {
   try {
      const postsObj = await Post.find({ classId: req.params.classid });
      const posts = [];
      for (const postObj in postsObj) {
         let post = postObj.toObject();
         post.teacher = teacherObj.username;
         post.student = studentObj.name;
         post.class = `${classObj.year} - ${classObj.department} ${classObj.batch_name}`;
         posts.push(post);
      }
      res.status(200).json({ posts: posts });
   } catch (err) {
      res.status(400).json({ error: err });
   }
});

// Filter posts by class id for teacher
router.get('/api/dashboard/filter/:classid/:teacherid', async (req, res) => {
   try {
      const postsObj = await Post.find({
         classId: req.params.classid,
         teacher_id: req.params.teacherid,
      }).sort({ date: -1 });
      const posts = [];
      for (let postObj of postsObj) {
         let post = postObj.toObject();
         const teacherObj = await Teacher.findById(post.teacher_id);
         post.teacher = teacherObj.username;
         const studentObj = await Student.findById(post.studentId);
         post.student = studentObj.name;
         const classObj = await Class.findById(post.classId);
         post.class = `${classObj.year} - ${classObj.department} ${classObj.batch_name}`;
         posts.push(post);
      }
      res.status(200).json({ posts: posts });
   } catch (err) {
      res.status(400).json({ error: err });
   }
});

// Post code
router.post('/api/code', (req, res) => {
   if (req.body.designation == 'Teacher') {
      console.log(req.body.description);
      const post = new Post({
         teacher_id: req.body.teacherid,
         studentId: req.body.studentid,
         classId: req.body.classid,
         description: req.body.description,
         username: req.body.username,
         email: req.body.email,
         code: req.body.code,
         input: req.body.input,
         output: req.body.output,
         extension: req.body.extension,
      });
      post.save(function (err) {
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
      console.log('Students cant post');
      res.send({
         status: false,
      });
   }
});

// Get statistics for teacher
router.get(
   '/api/dashboard/statistics/teacher/:userid/:username',
   async (req, res) => {
      try {
         const yourPosts = await Post.countDocuments({
            teacher_id: req.params.userid,
         });
         const allPosts = await Post.countDocuments();
         const myNotifications = await Notif.countDocuments({
            tousername: req.params.username,
         });
         res.status(200).json({
            yourPosts: yourPosts,
            allPosts: allPosts,
            myNotifications: myNotifications,
         });
      } catch (err) {
         console.log(err);
         res.status(400).json({ error: err });
      }
   }
);

// Get statistics for student
router.get(
   '/api/dashboard/statistics/student/:classid/:username',
   async (req, res) => {
      try {
         const batchPosts = await Post.countDocuments({
            classId: req.params.classid,
         });
         const allPosts = await Post.countDocuments();
         const myNotifications = await Notif.countDocuments({
            tousername: req.params.username,
         });
         res.status(200).json({
            batchPosts: batchPosts,
            allPosts: allPosts,
            myNotifications: myNotifications,
         });
      } catch (err) {
         console.log(err);
         res.status(400).json({ error: err });
      }
   }
);

// Delete post
router.delete('/api/dashboard/delete/:postid', async (req, res) => {
   const message = await Post.findByIdAndDelete(req.params.postid).then(
      () => 'Post deleted successfully'
   );
   res.json({ message });
});

module.exports = router;
