// ===================================
//    REMOVE FOR INTERNET EXPLORER
// ===================================
var log = function(input) {
  try {
    console.log(input);
  } catch (input) {
    // don't do nothing
  }
};
// ===================================

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
      log("====================================");
      log("       DISPLAYING A POST");
      log("====================================");
      log(post);
      log("====================================")
  });
});

// 7. UPVOTING ROUTE
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvotePost(function(err, post){
    if (err) { 
      return next(err); 
    }
    res.json(post);
    // log("======================================================");
    // log("            UPVOTING A PARTICULAR POST");
    // log("======================================================");
    // log(post);
    // log("======================================================");
  });
});

//8. COMMENTS ROUTE
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new theCommentsModel(req.body);
  comment.post = req.post;
  comment.save(function(err, comment){
    if(err){ 
      // return next(err);
    }
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }
      res.json(comment);
      log("====================================");
      log("       POSTING A COMMENT ");
      log("====================================");
      log(comment);
      log("====================================");
    });
  });
});

// 9. GET RETURNING A SINGLE COMMENT
router.get('/posts/:post/comments', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if ( post['_id'] == req.params.post ) {
      res.json(post.comments);
      log("====================================");
      log("   DISPLAYING COMMENTS OF A POST");
      log("====================================");
      log(post.comments);
      log("====================================")
    }
  });
});

// 10. GET PARTICULAR COMMENT OF A PARTICULAR POST
router.get('/posts/:post/comments/:comment', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    var commentsofapost = post.comments;
    for (var i = 0; i < commentsofapost.length; i++) {
      if (commentsofapost[i]['_id'] == req.params.comment) {
        res.json(commentsofapost[i]);
        log("======================================================");
        log("DISPLAYING PARTICULAR COMMENT OF A PARTICULAR POST");
        log("======================================================");
        log(commentsofapost[i]);
        log("====================================");
      };
    };
  })
});

// 11. UPVOTING ROUTE FOR COMMENTS IN A POST
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvoteComment(function(err, comment){
    if (err) { 
      return next(err); 
    }
    res.json(comment);
    // log("======================================================");
    // log("  UPVOTING A PARTICULAR COMMENT OF A PARTICULAR POST");
    // log("======================================================");
    // log(comment);
    // log("======================================================");
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
    log("====================================");
    log("       DISPLAYING ALL POSTS ");
    log("====================================");
    log(posts);
    log("====================================");
  });
});

// 4. POST POSTS
router.post('/posts', function(req, res, next) {
  var post = new ThePostsModel(req.body);
  post.save(function(err, post){
    if(err){ return next(err); }
    res.json(post);
    log("====================================");
    log("        POSTING A POST: ");
    log("====================================");
    log(post);
    log("====================================");
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

// 5.5 ROUTES FOR PRELOADING THE COMMENT OBJECTS
router.param('comment', function(req, res, next, id) {
  var query = theCommentsModel.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

module.exports = router;
