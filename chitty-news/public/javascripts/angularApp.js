angular.module('chitty', ['ui.router'])
  .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl as main'
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl as posts'
      })
    $urlRouterProvider.otherwise('home');
  }])
  // Controller for posting Posts
  .controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
    this.test = 'chitty';
    this.posts = [];
    this.addPost = function() {
      // prevent a user from submitting as post with a blank title
      if (this.title == '' || this.title == null) {
        alert("Blank")
      } else {
        this.posts.push({
          title: this.title,
          link: this.link,
          upvotes: 0,
          comments: [
            {author: 'Joe', body: 'Cool post!', upvotes: 0},
            {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
          ]
        });
        this.title = '';
        this.link = '';
      }
    }
    this.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
  }])
  // Controller for posting Comments
  .controller('PostsCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts) {
    this.title1 = 'Posts'
    this.post = posts.posts[$stateParams.id];
    this.addComment = function() {
      if (this.body == '' || this.body == null) {
        this.post.comments.push({
          body: this.body,
          author: 'User',
          upvotes: 0
        });
        this.body = '';
      }
    }
  }])
  .factory('posts', [function() {
    var o = {
      posts: []
    };
    return o;
  }])