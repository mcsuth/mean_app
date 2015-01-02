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

var mongoose = require('mongoose');

// 1. Schema
var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post' 
  }
});

// 2. Method for upvoting
CommentSchema.methods.upvoteComment = function(cb) {
  this.upvotes += 1;
  this.save(cb);
  log("======================================================");
  log("  UPVOTING A PARTICULAR COMMENT OF A PARTICULAR POST");
  log("======================================================");
  log(this);
  log("======================================================");
};

mongoose.model('Comment', CommentSchema);