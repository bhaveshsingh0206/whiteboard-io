const express = require('express'),
   router = express.Router(),
   mongoose = require('mongoose'),
   Post = require('../models/post'),
   bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:postid', async (req, res) => {
   try {
      const postObj = await Post.findById(req.params.postid);
      res.status(200).json(postObj);
   } catch (err) {
      res.status(400).json({ error: err });
   }
});

// router.get('student-room/download')

module.exports = router;
