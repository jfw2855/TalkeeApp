// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const movieSchema = new Schema(
	{
		imdbId: {type: String, required: true},
		title: { type: String, required: true },
		img: { type: String, required: true },
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Movie = model('Movie', movieSchema)

/////////////////////////////////
// Export Model
/////////////////////////////////
module.exports = Movie
