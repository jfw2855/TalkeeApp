// determines if a user is logged in
const auth = (req, res, next) => {
	if (req.session.loggedIn) {
		//allows user to access Talkee app
		next()
	} else {
		//user not logged in, redirected to login page
		res.redirect('/auth/login')
	}
}
//exports middleware
module.exports = { auth }
