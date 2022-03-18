// import dependencies
const mongoose = require('./connection')

// destructure the schema and model constructors from mongoose

const commentSchema = new mongoose.Schema({
		note: { type: String, required: true },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{ timestamps: true }
)


module.exports = commentSchema
