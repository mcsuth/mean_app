var express = require('express');
var router = express.Router();

// 1. GET HOME PAGE
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
  // This will print out 'this is a sample' when you go to localhost:3000
  //res.send('this is a sample')
});

// 6. GET RETURNING A SINGLE POST
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});

// 7. UPVOTING ROUTE
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

//8. COMMENTS ROUTE
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new theCommentsModel(req.body);
  comment.post = req.post;
  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

// 9. GET RETURNING A SINGLE COMMENT
router.get('posts/:post/comments', function(req, res, next) {
  ThePostsModel.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

// 2. REQUIRE MONGOOSE & MODELS & SCHEMAS
var mongoose = require('mongoose');
require('./../models/Posts');
require('./../models/Comments');
var ThePostsModel = mongoose.model('Post');
var theCommentsModel = mongoose.model('Comment');

// 3. GET POSTS
router.get('/posts', function(req, res, next) {
  ThePostsModel.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

// 4. POST POSTS
router.post('/posts', function(req, res, next) {
  var post = new ThePostsModel(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


// 5. ROUTES FOR PRELOADING POST OBJECTS
router.param('post', function(req, res, next, id) {
  var query = ThePostsModel.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});

module.exports = router;
