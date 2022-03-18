///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Social = require('./social')

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////
// save the connection in a variable
const db = mongoose.connection;

db.on('open', () => {
	// array of starter fruits
	const msgBoard = [
		{ title: 'message board'}
	]

	// when we seed data, there are a few steps involved
	// delete all the data that already exists(will only happen if data exists)
	Social.remove({})
        .then(deletedSocial => {
		    console.log('this is what remove returns', deletedSocial)
		    // then we create with our seed data
            Social.create(msgBoard)
                .then((data) => {
                    console.log('message board seed', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
	    })
        .catch(error => {
            console.log(error)
            db.close()
        })
	// then we can send if we want to see that data
})