// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const commentSchema = new Schema(
	{
		note: { type: String, required: true },
		posted: new Date,
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
)

const Comment = model('Comment', commentSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Comment
