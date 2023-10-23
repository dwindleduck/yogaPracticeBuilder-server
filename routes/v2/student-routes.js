const express = require("express")
const { createStudentToken, requireToken } = require("../../config/auth")
const { requireAdmin } = require("../../lib/requireAdmin")
const bcrypt = require("bcrypt")
const { handle404 } = require("../../lib/custom-errors")
const Student = require("../../models/student")

const router = express.Router()

// Sign up a new user
// POST /sign-up
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

// Sign in an existing user
// POST /sign-in
router.post("/v2/sign-in", (req, res, next) => {
    Student.findOne({ email: req.body.credentials.email})
        .then(student => {
            return {
                token: createStudentToken(req, student),
                student: student
            }
        })
        .then(userData => {
            res.json(userData)
        })
        .catch(next)
})

//Get details for the logged in user
// GET /student *user or admin
router.get("/v2/student", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404) 
        .then(student => {
            res.status(200).json({ student: student})
        })
        .catch(next)
})

// Update the user's information
// PATCH /student (for name, email, password) *user or admin
router.patch("/v2/student", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            return student.updateOne(req.body.student)
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})

// Delete the user
// DELETE /student  *user
router.delete("/v2/student", requireToken, (req, res, next) => {
	//find the logged in user
    Student.findById(req.user._id)
        .then(handle404) 
        .then((student) => {        
            student.deleteOne()
		})
		.then(() => res.sendStatus(204)) //success, no content returned
		.catch(next)
})

// Delete a user ***This is for admins***
// DELETE /student/:id  *admin








module.exports = router