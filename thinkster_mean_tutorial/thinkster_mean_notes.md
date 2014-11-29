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

25. Edit the routes/index.js file and create a GET route for retrieving posts in routes/index.js. It should return a JSON list containing all posts. Get rid of the existing code with the following:

		var mongoose = require('mongoose');
		var Post = mongoose.model('Post');
		var Comment = mongoose.model('Comment');
		
		router.get('/posts', function(req, res, next) {
		  Post.find(function(err, posts){
		    if(err){ return next(err); 
		  }
		    res.json(posts);
		  });
		});

26. Make fake data to see the GET request in the routes/index.js file. Add this:

		router.post('/posts', function(req, res, next) {
		  var post = new Post(req.body);
		
		  post.save(function(err, post){
		    if(err) {
		    	return next(err); 
		    }
		    res.json(post);
		  });
		});

27. Test the 2 routes: GET and POST with cURL

		curl --data 'title=test&link=http://test.com' http://localhost:3000/posts





# File Structure

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
		
		