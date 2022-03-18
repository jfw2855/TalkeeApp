// import dependencies
const req = require('express/lib/request')
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')
const commentSchema = require('./comment')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const socialSchema = new Schema(
	{
		title: String,
		comments: [commentSchema]
	},
	{ timestamps: true }
)

const Social = model('Social', socialSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Social
