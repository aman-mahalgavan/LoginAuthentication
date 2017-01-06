module.exports = {
	
	//https://developers.facebook.com/apps
	'facebookAuth': {
		'clientID': '*****************',
		'clientSecret': '***************************',
		'callbackURL': 'http://localhost:80/users/auth/facebook/callback',
	},
	
	//https://apps.twitter.com/app
	'twitterAuth': {
		'consumerKey': '*****************',
		'consumerSecret': '*********************************',
		'callbackURL': 'http://192.168.75.239:80/users/auth/twitter/callback',
	},
	
	//https://console.cloud.google.com/apis/credentials/oauthclient
	'googleAuth': {																	
		'clientID': '*****************',
		'clientSecret':  '***************************',
		'callbackURL': 'http://localhost:80/users/auth/google/callback',
	},
	
	//https://github.com/settings/applications/new
	'githubAuth': {
		'clientID': '*****************',
		'clientSecret':  '***************************',
		'callbackURL': 'http://localhost:80/users/auth/github/callback',
	},
	
	//https://www.linkedin.com/developer/apps
	'linkedinAuth': {
		'clientID': '*****************',
		'clientSecret':  '***************************',
		'callbackURL': 'http://localhost:80/users/auth/linkedin/callback',
	},
};
