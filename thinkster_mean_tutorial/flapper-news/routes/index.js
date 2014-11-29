var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


// 1. REQUIRE MONGOOSE & MODELS
var mongoose = require('mongoose');
require('./../models/Posts');
require('./../models/Comments');

// // THIS IS ALSO IN models/Posts.js
// var PostSchema = new mongoose.Schema({
//   title: String,
//   link: String,
//   upvotes: {type: Number, default: 0},
//   comments: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Comment' 
//   }]
// });
// var Post = mongoose.model('Posts', PostSchema);

// THIS IS ALSO IN models/Comments.js
// var CommentSchema = new mongoose.Schema({
//   body: String,
//   author: String,
//   upvotes: {type: Number, default: 0},
//   post: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Post' 
//   }
// });
// var Comment = mongoose.model('Comments', CommentSchema);

// 2. GET POSTS
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

// 3. POST POSTS
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


module.exports = router;
