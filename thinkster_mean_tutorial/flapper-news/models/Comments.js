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
  console.log("$$$$ ==== FIX ME - COMMENTS.JS ==== $$$$")
  console.log(this);
  console.log("$$$$ ========== $$$$")
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Comment', CommentSchema);