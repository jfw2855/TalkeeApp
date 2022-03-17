// Import Dependencies
const express = require('express')
const Movie = require('../models/movie')
const fetch = require('node-fetch')
const { response } = require('express')
const API_KEY = "k_k9n25mf8"
const apiSearch = `https://imdb-api.com/API/AdvancedSearch/${API_KEY}/?title=`
const apiBoxOffice = `https://imdb-api.com/en/API/BoxOffice/${API_KEY}`

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


// index that shows only the user's movies
router.get('/profile', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Movie.find({ owner: userId })
		.then(movies => {
			res.render('movie/profile', { movies, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})



// create -> POST route that actually calls the db and makes a new document
router.post('/add', (req, res) => {

	req.body.owner = req.session.userId
	Movie.create(req.body)
		.then(() => {
			res.redirect('/')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


// query show route

router.post('/search', async (req, res) => {
	// fetches the movie data from the imbd api
	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	}
	const query = req.body.movieSearch
	fetch(`${apiSearch}${query}`, requestOptions)
	.then(apiResp => apiResp.json())
	.then(data => {
		const {username, loggedIn, userId} = req.session
		const movie = data.results[0]


		res.render('movie/show',{movie,username,loggedIn,userId})
	})
	.catch(error => {
		console.log("error!", error)
	})

})


router.post('/inTheaters', async (req, res) => {
	// fetches the movie data from the imbd api
	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	}
	fetch(`${apiBoxOffice}`, requestOptions)
	.then(apiResp => apiResp.json())
	.then(data => {
		
		const movies = data.items

		console.log("this is the data from in theaters", movies)

		//res.render('movie/show',{data.items})


		//res.render('movie/show',{movie,username,loggedIn,userId})
	})
	.catch(error => {
		console.log("error!", error)
	})

})


// delete route
router.delete('/:id', (req, res) => {
	const movieId = req.params.id

	console.log('this is the movies id',movieId)
	Movie.findByIdAndRemove(movieId)
	.then(data => {
		console.log("DATA!",data)
		res.redirect('/movie/profile')
	})
	.catch(error => {
		res.redirect(`/error?error=${error}`)
	})
})

// Export the Router
module.exports = router
