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
        .then(token => res.json({ token: token }))
        .catch(next)
})


//UPDATE
//PATCH /students/:id
router.patch("/students/:id", requireToken, (req, res, next) => {
    Student.findById(req.params.id)
        .then(handle404)
        .then(student => {
            
            return student.updateOne(req.body.student)
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})








module.exports = router