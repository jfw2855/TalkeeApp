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
	// intializes the message board in the social model
	const msgBoard = [
		{ title: 'message board'}
	]

	// Deletes the social db then seeds the message board into
	Social.remove({})
        .then(() => {
		    // seeds the message board into the social db
            Social.create(msgBoard)
                .then((data) => {
                    console.log('message board seed', data)
                    db.close()
                })
                // shows an error if there is an issue 
                .catch(error => {
                    console.log(error)
                    db.close()
                })
	    })
        // shows an error if there is an issue 
        .catch(error => {
            console.log(error)
            db.close()
        })
})