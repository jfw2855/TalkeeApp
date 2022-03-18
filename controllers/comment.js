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

// DELETE -> to destroy a comment

//we'll use two params to make our life easier
//first the id of the fruit, since we need to find it
//then the id of the comment, since w want to delete it!!!!
router.delete('/', async (req,res)=> {
    //first we want to parse out our id
    const commId = req.body.id
    console.log("commIdddddd",{commId})
    // then we'll find the fruit
    Social.find({})
        .then(social => {
            console.log('social',social)

            let x = social[0].comments.id(commId)
            console.log('delete: THIS IS X ', x)
            const theComment = commId
            x.remove()
            return social[0].save()



            // for (let i = 0; i<x.length;i++ ) {
            //     if(x[i]._id==` new ObjectId("6231ef05f06e5a9a6308a1b1")`){
            //         console.log('found @',x[i]._id)
            //     }
            //     else {console.log('not founnd @',x[i]._id)}

            // }
            // social[0].update({title:"message board"}, {$pull: {comments: {_id: theComment}}})
                // return social[0].save()
            // console.log("this is the first comment's author",social.comments[0].author)
            //     // only delete the comment if the user who is logged in is the comment's author
            //     if (theComment.author == req.session.userId) {
            //     // then we'll delete the comment
            //     theComment.remove()
            //     // return the saved social
            //     return social.save()
            //     }else {
            //         return
            //     }
                
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