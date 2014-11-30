# MEAN

### Angular

1. Install Node
2. Install MongoDB
3. Create repo
4. Install Express & Angular & UI Route & Bootstrap
		
		npm install express
		npm install angular
		angular-ui-router
		npm install bootstrap
		
5. Create index.html
6. Create app.js file for angular


### Node & Express

7. Install Node & update Dependencies

		npm install -g express-generator
		express --ejs flapper-news
		cd flapper-news
		npm install
		
8. Install Mongoose		
		
		npm install --save mongoose		

9. Make folder called 'models' while cd'ed in flapper-news to make schemas

		mkdir models
		
10. Move the index.html file to the views/ directory & rename our index.html to index.ejs

		Because we're using the ejs engine, Node is looking for files with the .ejs extension so we're going to have to rename our index.html to index.ejs

11.  Move the Angular app.js file to the public/javascripts/ directory. To avoid confusion with Node's app.js, also rename the Angular file to angularApp.js.

12. Update the script tag in our index.ejs file to reflect these changes:13. 

		<script src="/javascripts/angularApp.js"></script>

13. Move app.js out of public/javascripts/ and into the main directory

14. Start app on http://localhost:3000

		npm start
		
		
15. Fix script tags and move files accordingly

### MongoDB

16. Edit app.js to include Mongoose

		// ADD MONGOOSE
		var mongoose = require('mongoose');
		mongoose.connect('mongodb://localhost/news');

17. Update npm for mongo

		npm install
		
18. Start mongod server in 1 tab (folder with project)

		sudo mongod
		
19. Open another terminal window & start mongo shell in another tab (same project folder)

		sudo mongo
		
20. In our models/ directory create a new file called Posts.js and add the following code:

		var mongoose = require('mongoose');
		
		var PostSchema = new mongoose.Schema({
		  title: String,
		  link: String,
		  upvotes: {type: Number, default: 0},
		  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
		});
		
		mongoose.model('Post', PostSchema);

		
21. In app.js, add the following line of code after our mongoose.connect call after 'mongoose.connect('mongodb://localhost/news');'

		require('./models/Posts');

22. Create another model called 'Comments.js'

		var mongoose = require('mongoose');
		
		var CommentSchema = new mongoose.Schema({
		  body: String,
		  author: String,
		  upvotes: {type: Number, default: 0},
		  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
		});
		
		mongoose.model('Comment', CommentSchema);

23. Include the Comments model in app.js 

		require('./models/Comments');

### RESTFUL ROUTING

24. Restful review:

		GET /posts - return a list of posts and associated metadata
		POST /posts - create a new post
		GET /posts/:id - return an individual post with associated comments
		PUT /posts/:id/upvote - upvote a post, notice we use the post ID in the URL
		POST /posts/:id/comments - add a new comment to a post by ID
		PUT /posts/:id/comments/:id/upvote - upvote a comment

25. Edit the routes/index.js file and create a GET route for retrieving posts in routes/index.js. It should return a JSON list containing all posts. 

		var express = require('express');
		var router = express.Router();
		
		// 1. GET HOME PAGE
		router.get('/', function(req, res) {
		  res.render('index', { title: 'Express' });
		});
		
		
		// 2. REQUIRE MONGOOSE & MODELS & SCHEMAS
		var mongoose = require('mongoose');
		require('./../models/Posts');
		require('./../models/Comments');
		var Post = mongoose.model('Post');
		var Comment = mongoose.model('Comment');
		
		// 3. GET POSTS
		router.get('/posts', function(req, res, next) {
		  Post.find(function(err, posts){
		    if(err){ return next(err); }
		
		    res.json(posts);
		  });
		});
		
		// 4. POST POSTS
		router.post('/posts', function(req, res, next) {
		  var post = new Post(req.body);
		
		  post.save(function(err, post){
		    if(err){ return next(err); }
		
		    res.json(post);
		  });
		});
		
		module.exports = router;

26. Make fake data to see the GET request in the routes/index.js file. Test the 2 routes: GET and POST with cURL

		curl --data 'title=test&link=http://test.com' http://localhost:3000/posts
		
		curl http://localhost:3000/posts 
		=== or ===
		checked http://localhost:3000/posts to see the saved JSON

### Pre-loading Objects
27. Create a route for preloading post objects in routes/index.js

		router.param('post', function(req, res, next, id) {
		  var query = Post.findById(id);
		
		  query.exec(function (err, post){
		    if (err) { return next(err); }
		    if (!post) { return next(new Error("can't find post")); }
		
		    req.post = post;
		    return next();
		  });
		});

28. Create our route for returning a single post

		router.get('/posts/:post', function(req, res) {
		  res.json(req.post);
		});

		check: http://localhost:3000/posts/<POST ID>
		
29. Add an upvote() method to the Posts schema in Posts.js for upvoting posts

		PostSchema.methods.upvote = function(cb) {
		  this.upvotes += 1;
		  this.save(cb);
		};

30. Create the upvoting route in our index.js

		router.put('/posts/:post/upvote', function(req, res, next) {
		  req.post.upvote(function(err, post){
		    if (err) { return next(err); }
		
		    res.json(post);
		  });
		});
		
31. Test this route

		curl -X PUT http://localhost:3000/posts/<POST ID>/upvote

32. Create comments route for a particular post in index.js

		router.post('/posts/:post/comments', function(req, res, next) {
		  var comment = new Comment(req.body);
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

33. Create a route for preloading comments objects in routes/index.js

		// 9. GET RETURNING A SINGLE COMMENT
		router.get('/comments/:comment', function(req, res) {
		  res.json(req.comment);
		});
		
		check: http://localhost:3000/comments/<POST ID>

34. make a slight modification to our GET /posts/:post route by using the populate() function to retrieve comments along with posts:

		router.get('/posts/:post', function(req, res, next) {
		  req.post.populate('comments', function(err, post) {
		    res.json(post);
		  });
		});

35. Implement getAll() to retrieve posts and inject the $http in the 'posts' factory within angularApp.js

		.factory('posts', ['$http', function($http){
		  ...
			o.getAll = function() {
			  return $http.get('/posts').success(function(data){
			    angular.copy(data, o.posts);
			  });
			};
		  ...
		});
		
		Notice that we're using the angular.copy() function to do this as it will make our UI update properly.

36. Now we need to call this function at an appropriate time to load the data. We do this by adding a property called resolve to our home state. Use the resolve property of ui-router to ensure posts are loaded:

		...
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
		...
		
		By using the resolve property in this way, we are ensuring that anytime our home state is entered, we will automatically query all posts from our backend before the state actually finishes loading.
		
37. Remove fake JSON in angularApp.js so your factory should look like this:

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
		
		Check your localhost to see all the entries in the DB http://localhost:3000/#/home
		
### Creating New Posts		
37. we need to enable creating new posts. As with loading posts, we're going to do this by adding another method to our posts factory:

		o.create = function(post) {
		  return $http.post('/posts', post).success(function(data){
		    o.posts.push(data);
		  });
		};

38. Now we can modify the $scope.addPost() method in MainCtrl to save posts to the server:

		$scope.addPost = function(){
		  if(!$scope.title || $scope.title === '') { return; }
		  posts.create({
		    title: $scope.title,
		    link: $scope.link,
		  });
		  $scope.title = '';
		  $scope.link = '';
		};

39. Update the upvoting posts method in the 'posts' factory

		o.upvote = function(post) {
		  return $http.put('/posts/' + post._id + '/upvote')
		    .success(function(data){
		      post.upvotes += 1;
		    });
		};

40. Modify incrementUpvotes() in the MainCtrl

		$scope.incrementUpvotes = function(post) {
			posts.upvote(post);
		};
    
41. Modify the Comments link to point to the proper route in the index.ejs

		<a href="#/posts/{{post._id}}">Comments</a>

42. Add a method in our 'posts' facotry to retrieve a single post from our server:

o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data;
  });
};

Notice that instead of using the success() method we have traditionally used, we are instead using a promise.

43. Add the resolve object to our posts state

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

44. To get access to the post object we just retrieved in the PostsCtrl, instead of going through the posts service, the specific object will be directly injected into our PostsCtrl. We can modify our controller to gain access to it like so:

		.controller('PostsCtrl', ['$scope', 'posts', 'post', '$stateParams', function($scope, posts, post, $stateParams){
		  $scope.post = post;
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

45. To enable adding comments add a method to the posts factory

		o.addComment = function(id, comment) {
		  return $http.post('/posts/' + id + '/comments', comment);
		};

46. Then edit the addComment() method in PostsCtrl

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

47. 




#
 File Structure

	app.js
	bin/
	node_modules/
	package.json
	public/
	routes/
	views/
	models/

# Mongodb

- Start mongod server

		mongod
		
- Open another terminal window & start mongo shell

		mongo
		
- Go to project folder with gruntfile and start grunt

		grunt
		
		