////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const Movie = require('../models/movie')
const fetch = require('node-fetch')
const { response } = require('express')
require('dotenv').config()

////////////////////////////////////////////
// API Variables
////////////////////////////////////////////
const API_KEY = process.env.API_KEY
const apiSearch = `https://imdb-api.com/API/AdvancedSearch/${API_KEY}/?title=`
const apiBoxOffice = `https://imdb-api.com/en/API/BoxOffice/${API_KEY}`


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


// Index route -> gets only the user's movies

router.get('/profile', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	//queries the Movie db to find the owner's movie list
	Movie.find({ owner: userId })
		.then(movies => {
			//renders the movie profile to display the user's movies
			res.render('movie/profile', { movies, username, loggedIn })
		})
		//shows an error page if there is an issue
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})



// Create route -> Posts that creates a new movie entry into the Movie db

router.post('/add', (req, res) => {
	// assigns the owner Id to the request from the session
	req.body.owner = req.session.userId
	//creates a new movie entry in the Movie db
	Movie.create(req.body)
		.then(() => {
			//redirects to the profile page
			res.redirect('/movie/profile')
		})
		//shows an error page if there is an issue
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


// Query Show route -> Sends an API request to the IMDB API to search for a movie title

router.post('/search', async (req, res) => {
	// sets the fetch method to GET data from the api 
	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	}
	//defines the movie search query to a variable
	const query = req.body.movieSearch
	//fetch the data from the API
	fetch(`${apiSearch}${query}`, requestOptions)
	//parses the response body text as JSON
	.then(apiResp => apiResp.json())
	.then(data => {
		// destructure user info from req.session
		const {username, loggedIn, userId} = req.session
		// grabs ONLY the first data index from the api response JSON data and defines to a variable
		const movie = data.results[0]
		// renders the show page with the movie's data (movie variable)
		res.render('movie/show',{movie,username,loggedIn,userId})
	})
	//shows an error if there is an issue w/ the api request
	.catch(error => {
		console.log("error!", error)
	})
})


// Query Show route -> Sends an API request to the IMDB API to display the movie's currently in theaters

router.post('/inTheaters', async (req, res) => {
	// fetches the movie data from the imdb api (GET)
	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	}
	//fetch the data form the API
	fetch(`${apiBoxOffice}`, requestOptions)
	//parses the response body text as JSON
	.then(apiResp => apiResp.json())
	.then(data => {
		// destructure user info from req.session
		const {username, loggedIn, userId} = req.session
		// stores all the movie theater data to a variable
		const movies = data.items
		// renders the theaters page to display movies currently in theaters
		res.render('movie/theaters',{movies,username,loggedIn,userId})
	})
	// shows an error if there is an issue with the API call
	.catch(error => {
		console.log("error!", error)
	})

})


// delete route -> removes a movie from a user's profile

router.delete('/:id', (req, res) => {
	// grabs the movie id from the request parameters
	const movieId = req.params.id
	// queries the Movie db for the movie and removes it
	Movie.findByIdAndRemove(movieId)
	.then(() => {
		// redirects back to the user's profile
		res.redirect('/movie/profile')
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
