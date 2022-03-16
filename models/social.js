// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const socialSchema = new Schema(
	{
		comments: [{
			type: Schema.Types.ObjectId,
			ref: 'Comment'}]
	},
	{ timestamps: true }
)

const Social = model('Social', socialSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Social
