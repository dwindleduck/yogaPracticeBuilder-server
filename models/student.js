const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			//hashed password results saved here
			type: String,
			required: true,
		},
		//not required
		token: String,
        name: {
			type: String,
			required: true,
		},
        knownPostures: {
			type: Array,
		},
        favoritedPractices: {
			type: Array,
		},
    
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, student) => {
				delete student.password
				return student
			},
		},
	}
)

module.exports = mongoose.model('Student', studentSchema)
