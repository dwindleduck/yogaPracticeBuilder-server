const express = require("express")
const { createStudentToken, requireToken } = require("../../config/auth")
const bcrypt = require("bcrypt")
const { handle404 } = require("../../lib/custom-errors")
const Student = require("../../models/student")

const router = express.Router()


// POST /sign-up

// POST /sign-in

// GET /student *user or admin

// GET /student/known-postures *user

// GET /student/favorite-practices *user

// PATCH /student (for name, email, password) *user or admin

// PATCH /student/known-postures *user

// PATCH /student/favorite-practices *user

// DELETE /student/:id  *user or admin

















// *********************************************************************************
// *********************************************************************************
// **********************Incorporate then delete everything below here**************
// *********************************************************************************
// *********************************************************************************
// *********************************************************************************

//Post /sign-up
router.post("/v2/sign-up", (req, res, next) => {
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
router.post("/v2/sign-in", (req, res, next) => {
    Student.findOne({ email: req.body.credentials.email})
        .then(student => createStudentToken(req, student))
        .then(token => {
            res.json({ token: token })
        })
        .catch(next)
})

//SHOW
//Get /student
router.get("/v2/student", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404) 
        .then(student => {
            res.status(200).json({ student: student})
        })
        .catch(next)
})



//UPDATE Known postures
// Patch /student/updateKnown
router.patch("/v2/student/updateKnown", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            student.knownPostures.push(req.body)
            return student.save()
        })
        .then(() => res.sendStatus(204)) //success, no content returned
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



//for favoriting a practice
//UPDATE
// Patch /student/updateFavorited
// router.patch("/student/updateFavorited", requireToken, (req, res, next) => {
//     Student.findById(req.user._id)
//         .then(handle404)
//         .then(student => {
//             student.favoritedPractices.push(req.body)
//             return student.save()
//         })
//         .then(() => res.sendStatus(204)) //success, no content returned
//         .catch(next)
// })








module.exports = router