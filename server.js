var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');

app.set("views", path.join(__dirname, "/"));
app.set("view_engine", "html").engine("html", function(path, options, fn) {
  if ("function" === typeof options) {
    fn = options;
    options = {};
  }
  return fs.readFile(path, "utf8", fn);
});
app.use(cookieParser());
app.use(expressSession({secret:'somesecrettokenhere',resave:false}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express["static"](path.join(__dirname, "/")));

app.get('/',function(req,res){
	res.render('index.html');
})

/* This page can be accessed only if the user is logged in and session is active */
app.get('/page',function(req,res){
	req.session.user ? res.render('page.html'):res.sendStatus(401);
})

/* Adds login information to current session */
app.post('/login',function(req,res){
	if(req.session){
		req.session.user = req.body;
		res.redirect('/page');
	}
	else res.send(400);
})

/* Destroys the current session */
app.get('/logout',function(req,res){
	req.session.destroy(function(e){
		res.redirect('/');
	})
})

/* View the current session */
app.get('/session',function(req,res){
	res.send(req.session.user);
})
app.listen(3000,function(){
	console.log("listening to port",3000);
})