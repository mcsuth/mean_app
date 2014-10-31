angular.module('chitty', [])
  .controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
    this.test = 'chitty';
    this.posts = [];
    this.addPost = function() {
      // prevent a user from submitting as post with a blank title
      if (this.title == '' || this.title == null) {
        alert("blabk")
      } else {
        this.posts.push({ 
          title: this.title, 
          link: this.link,
          upvotes: 0
        });
        this.title = '';
        this.link = '';
      }
    }
    this.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
    this.posts = posts.posts;
  }])
  .factory('posts', [function() {
    var o = {
      posts: []
    };
    return o;
  }])