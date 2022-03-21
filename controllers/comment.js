////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')
const Social = require('../models/social')
const comment = require('../models/comment')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Routes
////////////////////////////////////////////


// Create route -> Post comment to social model

router.post('/add', (req, res) => {
    
    // adjusts req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    req.body.userPost = req.session.username

    // finds all social contents
    Social.findOne({title:'message board'})
        .then(social => {
            // sends req.body to the comments array
            social.comments.push(req.body)
            //saves Social db
            return social.save()
        })
        .then(() => {
            // redirects to social page
            res.redirect(`/social`)
        })
        // shows an error if there is an issue
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})


// Edit route -> GET that takes us to the edit form view

router.get('/:id/edit', (req, res) => {
	// grabs the comment id (commId) from the request parameters
	const commId = req.params.id
	// finds all social content
    Social.find({})
        .then(social => {
            // grabs and defines the comment schema to a variable
            let theComment = social[0].comments.id(commId)
            //defines the username from the session
			const username = req.session.username
            //determines if a user is loggedIn from the session
			const loggedIn = req.session.loggedIn
            //renders the edit view page with the comment's information 
			res.render('social/edit', { theComment, username, loggedIn })
		})
        // shows an error if there is an issue
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})


// Update route -> Puts the updated comment to the social database

router.put('/:id', (req, res) => {
	// grabs the comment id (commId) from the request parameters
	const commId = req.params.id
	// finds all social content
    Social.find({})
        .then(social => {
            // grabs and defines the comment schema to a variable
            let theComment = social[0].comments.id(commId)
            // grabs and defines the updated comment note to a variable
            theComment.note = req.body.note
            //saves Social db
            return social[0].save()
        })
        .then(() => {
            //redirects to the social page
            res.redirect('/social')
        })
        // shows an error if there is an issue
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})


// Delete route -> removes the comment from the social database

router.delete('/', (req,res)=> {
    //parses out the comment id from the request body
    const commId = req.body.id
    // finds all social content
    Social.find({})
        .then(social => {
            // grabs and defines the comment schema to a variable
            let theComment = social[0].comments.id(commId)
            // removes the comment from the Social db
            theComment.remove()
            //saves Social db
            return social[0].save()
    })
    .then (() => { 
        // redirects back to social page
        res.redirect(`/social`)
    })
       // shows an error if there is an issue
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router