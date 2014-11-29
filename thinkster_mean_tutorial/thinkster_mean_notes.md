# MEAN

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
7. Install Node & update Dependencies

		npm install -g express-generator
		express --ejs flapper-news
		cd flapper-news
		npm install
		
8. Install Mongoose		
		
		npm install --save mongoose		

9. Make folder called 'models' while cd'ed in flapper-news

		mkdir models
		
10. Move the index.html file to the views/ directory & rename our index.html to index.ejs

		Because we're using the ejs engine, Node is looking for files with the .ejs extension so we're going to have to rename our index.html to index.ejs

11.  Move the Angular app.js file to the public/javascripts/ directory. To avoid confusion with Node's app.js, also rename the Angular file to angularApp.js.

12. Update the script tag in our index.ejs file to reflect these changes:13. 

		<script src="/javascripts/angularApp.js"></script>

13. Move app.js out of public/javascripts/ and into the main directory

14. Start app on http://localhost:3000

		npm start
		
		
15. Fix script tags accordingly



# File Structure

	app.js
	bin/
	node_modules/
	package.json
	public/
	routes/
	views/

# Mongodb

- Start mongod server

		mongod
		
- Open another terminal window & start mongo shell

		mongo
		
- Go to project folder with gruntfile and start grunt

		grunt
		
		