const express = require("express")
const { createStudentToken, requireToken } = require('../config/auth')
const bcrypt = require("bcrypt")
const { handle404 } = require("../lib/custom-errors")

const Student = require("../models/student")

const router = express.Router()






//Post /sign-up
router.post("/sign-up", (req, res, next) => {
    bcrypt
        .hash(req.body.credentials.password, 10)
        .then(hashedPassword => {
            return {
                email: req.body.credentials.email,
                password: hashedPassword,
                name: req.body.credentials.name
            }
        })
        .then(student => Student.create(student))
        .then(student => {
            //the studentSchema strips the password from the JSON
            res.status(201).json({ student: student })
        })
        .catch(next)
})


//Post /sign-in
router.post("/sign-in", (req, res, next) => {
    Student.findOne({ email: req.body.credentials.email})
        .then(student => createStudentToken(req, student))
        .then(token => {
            res.json({ token: token })
        })
        .catch(next)
})


//Not using this yet
//UPDATE
//PATCH /students/:id
// router.patch("/students/:id", requireToken, (req, res, next) => {
//     Student.findById(req.params.id)
//         .then(handle404)
//         .then(student => {
//             return student.updateOne(req.body.student)
//         })
//         .then(() => res.sendStatus(204)) //success, no content returned
//         .catch(next)
// })





//SHOW
//Get /student
router.get("/student", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404) 
        .then(student => {
            res.status(200).json({ student: student})
        })
        .catch(next)
})




//UPDATE
// Patch /student/updateKnown
router.patch("/student/updateKnown", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            student.knownPostures.push(req.body)
            return student.save()
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})


//UPDATE
// Patch /student/updateFavorited
router.patch("/student/updateFavorited", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            student.favoritedPractices.push(req.body)
            return student.save()
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})





module.exports = router