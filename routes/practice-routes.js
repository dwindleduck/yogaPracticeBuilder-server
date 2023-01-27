const express = require("express")
const { handle404 } = require("../lib/custom-errors")
const { requireToken } = require('../config/auth')
const Practice = require("../models/practice")
const Student = require("../models/student")
const router = express.Router()


const scrubPracticeForUser = (practices) => {
    const responsePractices = []
    practices.forEach(practice => {
        const updatedPractice = {
            name: practice.name,
            style: practice.style,
            description: practice.description,
            _id: practice._id
            }
        responsePractices.push(updatedPractice)
    })
    return responsePractices
}



//Index
//GET /practices
router.get("/practices", (req, res, next) => {
    Practice.find()
        .then(practices => {
            return practices.map(practice => practice)
        })
        .then(practices => {
            const responsePractices = scrubPracticeForUser(practices)
            res.status(200).json({ practices: responsePractices })
        })
        .catch(next)
})



//Index Practices by style
//GET /practices/style/:style
router.get("/practices/style/:style", (req, res, next) => {
    Practice.find({ style: {$eq: req.params.style} })
        .then(practices => {
            return practices.map(practice => practice)
        })
        .then(practices => {
            const responsePractices = scrubPracticeForUser(practices)
            res.status(200).json({ practices: responsePractices })
        })
        .catch(next)
})


//Index Practices by author
//GET /practices/author/:author
router.get("/practices/author/:author", requireToken, (req, res, next) => {
    Practice.find({ author: {$eq: req.params.author} })
        .then(practices => {
            return practices.map(practice => practice)
        })
        .then(practices => {
            const responsePractices = scrubPracticeForUser(practices)
            res.status(200).json({ practices: responsePractices })
        })
        .catch(next)
})



//Index by favoritedPractices
//Get /practices/favorited/:userId
router.get("/practices/favorited/:userId", requireToken, (req, res, next) => {
    Student.findById(req.params.userId)
        .populate("favoritedPractices")
        .then(handle404)
        .then(student => {
            return student.favoritedPractices
        })
        .then(practices => {
            return practices.map(practice => practice)
        })
        .then(practices => {
            const responsePractices = scrubPracticeForUser(practices)
            res.status(200).json({ practices: responsePractices })
        })
        .catch(next)
})


//Index by student's built
//GET /known
router.get("/built", requireToken, (req, res, next) => {
    Practice.find({ author: {$eq: req.user._id} })
    .then(practices => {
        return practices.map(practice => practice)
    })
    .then(practices => {
        const responsePractices = scrubPracticeForUser(practices)
        res.status(200).json({ practices: responsePractices })
    })
    .catch(next)
})











//Practice by Id
//GET /practices/:id
router.get("/practices/:id", requireToken, (req, res, next) => {
    Practice.findById(req.params.id)
    .populate(["author", "sequence"])
    .then(handle404)   
    .then(practice => {
            res.status(200).json({ practice: practice})
        })
    .catch(next)
})







//Create
//POST /practices
router.post("/practices", requireToken, (req, res, next) => {
    //req.body will have person with something in it
    Practice.create(req.body.practice)
        .then(practice => {
            res.status(201).json({ practice: practice }) //201: something was created on the server successfully
        })
        .catch(next)
})

//UPDATE
//PATCH /practices/:id
router.patch("/practices/:id", requireToken, (req, res, next) => {
    Practice.findById(req.params.id)
        .then(handle404) 
        .then(practice => {
            return practice.updateOne(req.body.practice)
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})


//DELETE
//DELETE /practices/:id
router.delete('/practices/:id', requireToken, (req, res, next) => {
	Practice.findById(req.params.id)
        .then(handle404) 
        .then((practice) => {
			practice.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})




module.exports = router