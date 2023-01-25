// requiring the connected mongoose
const mongoose = require('mongoose')

// getting the Schema
const Schema = mongoose.Schema

const Student = require("./student")
const Posture = require("./posture")

const practiceSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    style: {
        type: String,
        enum: [
            "vinyasa",
            "restorative",
            "astanga",
        ]
    },
    sequence: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posture",
        required: true
    }],
    // template: {
    //     lengthOfPractice: {
    //         type: String
    //     },
    //     style: {
    //         type: String
    //     },
    // }
}, {
    timestamps: true 
})


const Practice = mongoose.model('Practice', practiceSchema)

module.exports = Practice