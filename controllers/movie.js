// Import Dependencies
const express = require('express')
const Movie = require('../models/movie')
const fetch = require('node-fetch')
const { response } = require('express')
const API_KEY = "k_k9n25mf8"
const apiURL = `https://imdb-api.com/API/AdvancedSearch/${API_KEY}/?title=`
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

router.post('/test', (req,res)=> {
	console.log("req body",req.body)
	res.send('test post reached')
})







// create -> POST route that actually calls the db and makes a new document
router.post('/add', (req, res) => {

	req.body.owner = req.session.userId
	Movie.create(req.body)
		.then(example => {
			console.log('this was returned from create', example)
			res.redirect('/')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const exampleId = req.params.id
	Example.findById(exampleId)
		.then(example => {
			res.render('examples/edit', { example })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const exampleId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Example.findByIdAndUpdate(exampleId, req.body, { new: true })
		.then(example => {
			res.redirect(`/examples/${example.id}`)
		})
		.catch((error) => {
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
	fetch(`${apiURL}${query}`, requestOptions)
	.then(apiResp => apiResp.json())
	.then(data => {
		const movie = data.results[0]
		const title = movie.title
		const imbd_id = movie.id
		const year = movie.description
		const img = movie.image
		const genres = movie.genres
		const rating = movie.imDbRating
		const plot = movie.plot

		res.render('movie/show',{year,title,imbd_id,img,genres,rating,plot})
	})
	.catch(error => {
		console.log("error!", error)
	})

})



// show route
router.get('/:id', (req, res) => {
	const exampleId = req.params.id
	Example.findById(exampleId)
		.then(example => {
            const {username, loggedIn, userId} = req.session
			res.render('examples/show', { example, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const exampleId = req.params.id
	Example.findByIdAndRemove(exampleId)
		.then(example => {
			res.redirect('/examples')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
