// requiring the connected mongoose
const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate');

// getting the Schema
const Schema = mongoose.Schema

const postureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    translation: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    portionOfPractice: {
        type: String,
        enum: [
            "opening",
            "standing",
            "seated",
            "flying",
            "back-bending",
            "inversions",
            "reclining",
            "resting",
        ]
    },
    instructions: {
        breath: {
            type: String
        },
        bandha: {
            type: String
        },
        gaze: {
            type: String
        },
        mudra: {
            type: String
        },
        timeToSpend: {
            type: String
        }
    },
    image: {
        medium: {
            type: String
        },
        original: {
            type: String
        }
    },
}, {
    timestamps: true 
})

postureSchema.plugin(mongoosePaginate);

const Posture = mongoose.model("Posture", postureSchema)

module.exports = Posture