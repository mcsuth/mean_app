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

angular.module('flapperNews', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('home', {
        url : '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }
      })
      .state('posts', {
        url : '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl', 
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
      });
    $urlRouterProvider.otherwise('home');
  }])

  .factory('posts', ['$http', function($http) {
    var o = {
      posts: []
    };
    // method for getting exisiting posts
    o.getAll = function() {
      return $http.get('/posts').success(function(data){
        angular.copy(data, o.posts);
      });
    };
    // method for creating new posts
    o.create = function(post) {
      return $http.post('/posts', post).success(function(data){
        o.posts.push(data);
      });
    };
    // method for updating upvoting posts
    o.upvote = function(post) {
      return $http.put('/posts/' + post._id + '/upvote')
        .success(function(data){
          post.upvotes += 1;
        });
    };
    // method for getting a single post
    o.get = function(id) {
      return $http.get('/posts/' + id).then(function(res){
        return res.data;
      });
    };
    // method for posting comments
    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    };
    o.upvoteComment = function(post, comment) {
      // debugger
      return $http.put('/posts/' + post + '/comments/'+ comment + '/upvote')
        .success(function(data){
          comment.upvotes += 1;
          // debugger
        })
        .error(function(data){
          log("upvote not working");
          document.write('<span style="font-family: Verdana">'+data+'</span>');
        })
    };
    return o;
  }])

  .controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
    $scope.webtitle = "Alpha Reddit"
    $scope.posts = posts.posts;
    // Updated addPost function to save to server
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
      posts.create({
        title: $scope.title,
        link: $scope.link,
      });
      $scope.title = '';
      $scope.link = '';
    };
    // Updated incrementUpvotes function to save to server
    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    };
  }])

  .controller('PostsCtrl', ['$scope', 'posts', 'post', '$stateParams', function($scope, posts, post, $stateParams){
    $scope.post = post;
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
    $scope.incrementUpvotes = function(post, comment){
      posts.upvoteComment(post, comment);
    };
  }])