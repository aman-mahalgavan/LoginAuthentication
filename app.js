var express = require('express'),							// Allows to set up middlewares to respond to HTTP Requests.  Allows to dynamically render HTML Pages based on passing arguments to templates.
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),				// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
	bodyParser = require('body-parser'),					// This is a node.js middleware for handling JSON, Raw, Text and URL encoded form data.
	exphbs = require('express-handlebars'), 				// Layout and partials Mechanisam can be used.  
	expressValidator = require('express-validator'),		// express-validation is a middleware that validates the body, params, query, headers and cookies of a request and returns a response with errors; if any of the configured validation rules fail.
	flash = require('connect-flash'),						// The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. 
	session = require('express-session'),					// To set app.use(session)
	
	passport = require('passport'),							// Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.
	LocalStrategy = require('passport-local').Strategy,		// Before asking Passport to authenticate a request, the strategy (or strategies) used by an application must be configured. Strategies, and their configuration, are supplied via the use() function.
	
	mongoose = require('mongoose'),							// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
	
	server = require('http').createServer(app),				// Create server as app and listen app with socket.io
	io = require('socket.io').listen(server),
	fs = require('fs'),										// Returns a new WriteStream object.
	util = require('util'),									// This module also works in modern browsers. If you need legacy browser support you will need to polyfill ES5 features.
	timestamp = require('console-timestamp'),				// To set schedule and timer
	
	routes = require('./routes/index'),						// Routing 
	users = require('./routes/users');

//MongoDB Connection
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
console.log('mongodb connected.');

app.set('views', path.join(__dirname, 'views'));			// View Engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));	
app.set('view engine', 'handlebars');

app.use(bodyParser.json());									// Returns middleware that only parses json. This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
app.use(bodyParser.urlencoded({ extended: false }));		// Returns middleware that only parses urlencoded bodies. This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings. extended - parse extended syntax with the qs module. (default: true)
app.use(cookieParser());									// Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 
app.use(express.static(path.join(__dirname, 'public')));	// Set Static Folder

app.use(session({secret: 'secret', saveUninitialized: true, resave: true}));
app.use(passport.initialize());								// passport.initialize() middleware is required to initialize Passport. 
app.use(passport.session());								// If your application uses persistent login sessions, passport.session() middleware must also be used.
app.use(flash());

app.use(expressValidator({									// The errorFormatter option can be used to specify a function that must build the error objects used in the validation result returned by req.getValidationResult(). It should return an Object that has param, msg, and value keys defined.
	errorFormatter: function(param, msg, value) {		
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
			}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));							

app.use(function (req, res, next) {							// Global Vars
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;						// user comes from here...
	res.locals.ledStatus = req.ledStatus;
	next();
});

app.use('/', routes);
app.use('/users', users);

server.listen(80, function(){								// Set Port
	console.log('\nDD-MM-YY : hh:mm:ss'.timestamp, ': Start listening on Port *.80');
}); 

io.on('connection', function (socket) {						// io.on Connection Part
	console.log('\nDD-MM-YY : hh:mm:ss'.timestamp, ': User connected\n');
		socket.on('disconnect', function(){
	});
});

var logFile = fs.createWriteStream('status.txt', { flags: 'w' }),	// Or 'w' to truncate the file every time the process starts. or 'a' 
	logStdout = process.stdout;
	console.log = function () {
		logFile.write(util.format.apply(null, arguments) + '\n');
		logStdout.write(util.format.apply(null, arguments) + '\n');
	}
console.error = console.log;

module.exports = app;
