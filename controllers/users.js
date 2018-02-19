'use strict';

module.exports = function(_, passport){

	return {
		SetRouting: function(router){
			router.get('/', this.indexPage);
			router.get('/signup', this.getSignUp);
			router.get('/home', this.homepage);


			router.post('/signup', this.postSignUp);
		},
		
		indexPage: function(req, res){
			return res.render('index');
		},

		getSignUp: function(req, res){
			return res.render('signup');
		},

		postSignUp: passport.authenticate('local.signup', {
			successRedirect: '/homepage',
			failureRedirect: '/signup',
			failureFlash: true
		}),

		homepage: function(req, res){
			return res.render('home');
		}
		
	}

}