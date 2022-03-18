// Import Dependencies
const express = require('express')
const Social = require('../models/social')
const comment = require('../models/comment')
// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	
	Social.find({title:'message board'})
		.then(social => {
			//console.log("COMMENTS IN SOCIAL", social.comments)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const comments = social[0].comments
			console.log('this is the social!!!!',comments)

			
			res.render('social/index', {comments, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})




// Export the Router
module.exports = router
