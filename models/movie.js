// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const movieSchema = new Schema(
	{
		title: { type: String, required: true },
		img: { type: String, required: true },
        genres: [{ type: String, required: true }],
		rating: { type: Number, required: true },
		plot: {type: String, required: true},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Movie = model('Movie', movieSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Movie
