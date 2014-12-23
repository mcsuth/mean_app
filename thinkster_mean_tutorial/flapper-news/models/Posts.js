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
var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }]
});

// 2. Method for upvoting
PostSchema.methods.upvotePost = function(cb) {
  this.upvotes += 1;
  this.save(cb);
  log("======================================================");
  log("            UPVOTING A PARTICULAR POST");
  log("======================================================");
  log(this);
  log("======================================================");
};

mongoose.model('Post', PostSchema);