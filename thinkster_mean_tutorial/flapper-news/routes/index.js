var express = require('express');
var router = express.Router();

// 1. GET HOME PAGE
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


// 2. REQUIRE MONGOOSE & MODELS & SCHEMAS
var mongoose = require('mongoose');
require('./../models/Posts');
require('./../models/Comments');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// 3. GET POSTS
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

// 4. POST POSTS
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

module.exports = router;
