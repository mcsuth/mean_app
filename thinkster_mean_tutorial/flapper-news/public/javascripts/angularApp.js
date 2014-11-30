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
        controller: 'PostsCtrl'
      });
    $urlRouterProvider.otherwise('home');
  }])

  .factory('posts', ['$http', function($http) {
    var o = {
      posts: [
        // {title: 'First Post', upvotes: 2, comments: 
        //   [
        //     {author: 'Joe', body: 'Cool post!', upvotes: 0},
        //     {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        //   ]}
      ]
    };
    o.getAll = function() {
      return $http.get('/posts').success(function(data){
        angular.copy(data, o.posts);
      });
    };
    return o;
  }])

  .controller('MainCtrl', ['$scope', 'posts', function($scope, posts){
    $scope.webtitle = "Meanie Posts"
    $scope.posts = posts.posts;
    $scope.addPost = function() {
      if(!$scope.title || $scope.title === '' || $scope.title === undefined) { 
        alert('Empty!');
      } else {
        $scope.posts.push({
          title: $scope.title,
          link: $scope.link,
          upvotes: 0,
          comments: []
        });
        $scope.title = '';
        $scope.link = '';
      }
    };
    $scope.incrementUpvotes = function(post) {
      post.upvotes +=1;
    };
    $scope.incrementDownvotes = function(post) {
      post.upvotes -=1;
    };
  }])

  .controller('PostsCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){
    $scope.post = posts.posts[$stateParams.id];
    $scope.addComment = function(){
      if($scope.body === undefined) { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'Smith',
        upvotes: 0
      });
      $scope.body = '';
    };
  }])