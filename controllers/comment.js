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
            console.log("updated comments section", social.comments)
            // redirect
            res.redirect(`/social`)
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})



////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router