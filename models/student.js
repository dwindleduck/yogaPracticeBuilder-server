const mongoose = require("mongoose")
const Practice = require("./practice")
const Posture = require("./posture")

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
        knownPostures: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Posture",
				required: true
		}], 
		favoritedPractices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Practice",
            required: true
        }],   

		permissionLevel: {
			type: String,
			enum: [
				"student",
				"admin",
			],
			default: "student",
			required: true,
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

const Student = mongoose.model("Student", studentSchema)

module.exports = Student