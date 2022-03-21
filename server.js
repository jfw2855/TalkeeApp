////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")
const middleware = require('./utils/middleware')
const UserRouter = require('./controllers/user')
const MovieRouter = require('./controllers/movie')
const SocialRouter = require('./controllers/social')
const CommentRouter = require('./controllers/comment')
const User = require("./models/user")
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////////////////////////////
// Routes
////////////////////////////////////////////

app.use('/auth', UserRouter)
app.use('/movie', MovieRouter)
app.use('/social', SocialRouter)
app.use('/comments', CommentRouter)

//index route -> gets the homescreen of the Talkee app

app.get('/', (req, res) => {
	// destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	// renders the landing page
	res.render('index.liquid', { loggedIn, username, userId })
})

// error route -> gets the error page if a user trys to access a non-existent page

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})