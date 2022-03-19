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
// only need two routes for comments right now
// POST -> to create a comment


router.post('/add', (req, res) => {
    console.log('first comment body', req.body)
    
    // adjusts req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    req.body.userPost = req.session.username
    console.log('updated comment body', req.body)
    // find all social contents
    Social.findOne({title:'message board'})
        .then(social => {
            // sends req.body to the comments array
            console.log("this is the entry", social)
            social.comments.push(req.body)
            return social.save()

        })
        .then(social => {
            //console.log("updated comments section", social.comments)
            // redirect
            res.redirect(`/social`)
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})


// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const commId = req.params.id
	// find all social content
    Social.find({})
        .then(social => {
            console.log('social',social)
            let theComment = social[0].comments.id(commId)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('social/edit', { theComment, username, loggedIn })
		})
		// or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

// update route -> sends a put request to our database
router.put('/:id', (req, res) => {
	// get the id
	const commId = req.params.id
    console.log("this is the req body",req.body)
	// check and assign the readyToEat property with the correct value
    Social.find({})
        .then(social => {
            let theComment = social[0].comments.id(commId)
            console.log('theComment from udpate',theComment)
            theComment.note = req.body.note
            return social[0].save()
        })
        .then(() => {
            res.redirect('/social')
        })

		.catch((error) => res.json(error))
})





// DELETE -> to destroy a comment

router.delete('/', (req,res)=> {
    //first we want to parse out our id
    const commId = req.body.id
    console.log("commIdddddd",{commId})
    // finds social content
    Social.find({})
        .then(social => {
            console.log('social',social)

            let theComment = social[0].comments.id(commId)

       
            theComment.remove()
            return social[0].save()
    })
    .then (() => { 
        // redirects back to social page
        res.redirect(`/social`)
    })
       // catch any errors!
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router