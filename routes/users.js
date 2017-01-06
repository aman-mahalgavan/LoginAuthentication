var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user'),
	configAuth = require('../config/auth'),
	
	mongoose = require('mongoose'),
	db = mongoose.connection,
	collection = db.collection('users'),
	collection1 = db.collection('search'),
	ObjectId = mongoose.Types.ObjectId,			//Casting for Object ID
	
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	GithubStrategy = require('passport-github').Strategy;
	LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

	passport.serializeUser(function(user, done) {		//The serialization and deserialization logic is supplied by the application, allowing the application to choose an appropriate database and/or object mapper, without imposition by the authentication layer.
		done(null, user.id);								//In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
	});

	passport.deserializeUser(function(id, done) {		//When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
		User.getUserById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy(									//By default, LocalStrategy expects to find credentials in parameters named username and password.
		function(username, password, done) {						//Passport Strategies, and their configuration, are supplied via the use() function.
			User.getUserByUsername(username, function(err, user){
				if(err) throw err;
				if(!user){
					return done(null, false, {message: 'Unknown User'});
				}

			User.comparePassword(password, user.local.password, function(err, isMatch){		//isMatch from user.js callback
				if(err) throw err;
				if(isMatch){
					console.log('Welcome to automation page ' + username +'.');
					return done(null, user);
				} else {			
					console.log('invalid password ' + local.username +'. Please try again.');
					return done(null, false, {message: 'Invalid password ' + local.username +'. Please try again.'});
					}
				});
			});
		}
	));

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'email', 'first_name', 'last_name'],
	},
	 function(token, refreshToken, profile, done) {
		process.nextTick(function() {
		  User.findOne({ 'facebook.id': profile.id }, function(err, user) {
			if (err)
			  return done(err);
			if (user) {
			  return done(null, user);
			} else {
			  var newUser = new User();
			  newUser.facebook.id = profile.id;
			  newUser.facebook.token = token;
			  newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
			  newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

			  newUser.save(function(err) {
				if (err)
				  throw err;
				return done(null, newUser);
			  });
			}
		  });
		});
	 }));

	passport.use(new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL,
	  },
	  function(token, tokenSecret, profile, done) {
		process.nextTick(function() {
		  User.findOne({ 'twitter.id': profile.id }, function(err, user) {
			if (err)
			  return done(err);
			if (user) {
			  return done(null, user);
			} else {
			  var newUser = new User();
			  newUser.twitter.id          = profile.id;
			  newUser.twitter.token       = token;
			  newUser.twitter.name	      = profile.name;
			  newUser.twitter.displayName = profile.displayName;
			  newUser.save(function(err) {
				if (err)
				 throw err;
				return done(null, newUser);
			  });
			}
		  });
		});
	  })); 

	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret,
		callbackURL: configAuth.googleAuth.callbackURL,
	  },
		function(token, refreshToken, profile, done) {
		  process.nextTick(function() {
			User.findOne({ 'google.id': profile.id }, function(err, user) {
			  if (err)
				return done(err);
			  if (user) {
				return done(null, user);
			  } else {
				var newUser = new User();
				newUser.google.id = profile.id;
				newUser.google.token = token;
				newUser.google.name = profile.displayName;
				newUser.google.email = profile.emails[0].value;
				newUser.save(function(err) {
				  if (err)
					throw err;
				  return done(null, newUser);
				});
			  }
			});
		  });
		}));
		
	passport.use(new GithubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL,
	  },
		function(token, refreshToken, profile, done) {
		  process.nextTick(function() {
			User.findOne({ 'github.id': profile.id }, function(err, user) {
			  if (err)
				return done(err);
			  if (user) {
				return done(null, user);
			  } else {
				var newUser = new User();
				newUser.github.id = profile.id;
				newUser.github.token = token;
				newUser.github.name = profile.displayName;
				newUser.github.email = profile.emails[0].value;
				newUser.save(function(err) {
				  if (err)
					throw err;
				  return done(null, newUser);
				});
			  }
			});
		  });
		}));
		
	passport.use(new LinkedInStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL,
	  },
		function(token, refreshToken, profile, done) {
		  process.nextTick(function() {
			User.findOne({ 'github.id': profile.id }, function(err, user) {
			  if (err)
				return done(err);
			  if (user) {
				return done(null, user);
			  } else {
				var newUser = new User();
				newUser.github.id = profile.id;
				newUser.github.token = token;
				newUser.github.name = profile.displayName;
				newUser.github.email = profile.emails[0].value;
				newUser.save(function(err) {
				  if (err)
					throw err;
				  return done(null, newUser);
				});
			  }
			});
		  });
		}));
		
//FacebookStrategy
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/users/login',}));

//TwitterStrategy
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/users/login',}));

//GithubStrategy
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/users/login',}));

//GithubStrategy
router.get('/auth/github', passport.authenticate('github', { scope: ['profile', 'email'] }));
router.get('/auth/github/callback', passport.authenticate('github', {successRedirect: '/', failureRedirect: '/users/login',}));

//LinkedinStrategy
router.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ['profile', 'email'] }));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {successRedirect: '/', failureRedirect: '/users/login',}));

//Login
router.get('/login'	, function(req, res){ 
	res.render('login'); 
});
router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true,}));

//Logout
router.get('/logout', function(req, res){			// Get Method for for logout
	req.logout();
	req.flash('success_msg', 'You are logged out.');
	res.redirect('/users/login');
	console.log('User logout.' );
});
	
//Register
router.get('/register', function(req, res){ 
	res.render('register'); 
});
router.post('/register', function(req, res){					// Post method from register.handlebars // Register User
	var name = req.body.name,									// Set variable for req.body	
		email = req.body.email,
		username = req.body.username,
		password = req.body.password,
		password2 = req.body.password2,
		contactno = req.body.contactno,
		file = req.body.file,
		date = req.body.date;
		

	req.checkBody('name', 'Name is required').notEmpty();		// Validation for req.body.var-name & check status from result for Emtry & Passowrd match
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('contactno', 'Contactno is required').notEmpty();
	req.checkBody('file', 'file is required');	
	req.checkBody('date', 'Date is required');
	
	var errors = req.validationErrors();						// Set Variable for error and show Validation errors
	if(errors){
		res.render('register',{errors:errors});					// Send user to Register page and shows error 
	} else {
		var newUser = new User();								//User = require('../models/user'); Create New variable newUSer to store data in mongoDb
			newUser.local.name = name;											// Check left side same var in user.js while store data in mongodb
			newUser.local.email = email;
			newUser.local.username = username;
			newUser.local.password = password;
			newUser.local.contactno = contactno;
			newUser.local.file = file;
			newUser.local.date = date;
	
		User.createUser(newUser, function(err, user){			// Create User 
			if(err) throw err;
		});

		req.flash('success_msg', name + ', you are registered and can now login.');
			console.log(name + ' is registered.');
			//require('./mailer.js').sendEmail(newUser);
		res.redirect('/users/login');
		}
});

module.exports = router;
