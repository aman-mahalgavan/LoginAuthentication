var timerId,
	http = require('http'),
	fs = require('fs'),
	clientId = "FREE_TRIAL_ACCOUNT", // No need to change
	clientSecret = "PUBLIC_SECRET", // No need to change

	User = require('../routes/users'),

	nodemailer = require('nodemailer'),			//Mail
	transporter = nodemailer.createTransport({
	service : 'Gmail',
	auth: {
		user: 'addyouremail@gmail.com',
		pass: 'passowrd@123'
	}
});

module.exports.sendEmail = function(newUser) {
	if (timerId) return;
	timerId = setTimeout(function() {
		clearTimeout(timerId);
		timerId = null;
	}, 10000);
	console.log('Sendig a Message & Email... ' + newUser.local.name );
 
	var mailOptions = {
		from	: 'Your  Company <your.company.alert@gmail.com>',
		to   	:  newUser.local.email,
		subject	: 'Your name : Registration Details',
		html	: '<b>' + newUser.local.name + '</b>, <br/><br/>Thank you for registered in Company. <br/><br/> At : ' + Date() + '<br/><br/>Your Username is: ' + newUser.local.username + ' and Password is: ' + newUser.local.password + '. <br/><br/> Thanks,<br/><i>Company</i>'
	};
 
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
		  console.log(error);
		} else {
		  console.log('Mail sent: ' + info.response);
		}
	}); 

	//Whatsapp and Telegram
	var jsonPayload = JSON.stringify({
		number: "***********",				//Add your number
		message: newUser.local.name + ", Thank you for registered in Company.  At: " +  Date() + ". Your username is: " + newUser.local.username + " and Password is: " + newUser.local.password + ". Thank you." ,
	});

	var options1 = {
		hostname: "api.whatsmate.net",
		port	: 80,
		path	: "/v1/whatsapp/queue/message",
		method	: "POST",
		headers	: {
			"Content-Type": "application/json",
			"X-WM-CLIENT-ID": clientId,
			"X-WM-CLIENT-SECRET": clientSecret,
			"Content-Length": Buffer.byteLength(jsonPayload)
		}
	};

	var options2 = {
		hostname: "api.whatsmate.net",
		port	: 80,
		path	: "/v1/telegram/single/message/0",
		method	: "POST",
		headers	: {
			"Content-Type": "application/json",
			"X-WM-CLIENT-ID": clientId,
			"X-WM-CLIENT-SECRET": clientSecret,
			"Content-Length": Buffer.byteLength(jsonPayload)
		}
	};

	var options3 = {
		hostname: "api.whatsmate.net",
		port	: 80,
		path	: "/v1/telegram/single/photo/binary/0",
		method	: "POST",
		headers	: {
			"Content-Type": "application/json",
			"X-WM-CLIENT-ID": clientId,
			"X-WM-CLIENT-SECRET": clientSecret,
			"Content-Length": Buffer.byteLength(jsonPayload)
		}
	};

	var request1 = new http.ClientRequest(options1),
		request2 = new http.ClientRequest(options2),
		request3 = new http.ClientRequest(options3);

	request1.end(jsonPayload);
	request2.end(jsonPayload);
	request3.end(jsonPayload);

	request1.on('response', function (response) {
		console.log('Heard back from the WhatsMate Gateway:\n');
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log(chunk);
		});
	});

	request2.on('response', function (response) {
		console.log('Heard back from the Telegram Gateway:\n');
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log(chunk);
		});
	});

	request3.on('response', function (response) {
		console.log('Heard back from the Telegram Image Gateway:\n');
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log(chunk);
		});
	});
}
