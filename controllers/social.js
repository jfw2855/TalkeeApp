////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const Social = require('../models/social')
const comment = require('../models/comment')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

///////////////////////////////////////////
// Authorization Middleware
///////////////////////////////////////////

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

////////////////////////////////////////////
// Routes
////////////////////////////////////////////

// Index route -> gets all comments to display on social page

router.get('/', (req, res) => {
	
	// finds all social content in message board
	Social.find({title:'message board'})
		.then(social => {
			// destructure user info from req.session
			const { username, userId, loggedIn } = req.session
			// stores the comments array in the db to a variable
			const comments = social[0].comments
			// renders the social index page 
			res.render('social/index', {userId, comments, username, loggedIn })
		})
		//shows an error page if there is an issue
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router
