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
  console.log("$$$$ ==== POST.JS ==== $$$$")
  console.log(this);
  console.log("$$$$ ========== $$$$")
};

mongoose.model('Post', PostSchema);