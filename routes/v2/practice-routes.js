const express = require("express")
const { handle404 } = require("../../lib/custom-errors")
const { requireToken } = require("../../config/auth")
const Practice = require("../../models/practice")
const Student = require("../../models/student")
const router = express.Router()

const scrubPracticeForUser = (practices) => {
    const responsePractices = []
    practices.forEach(practice => {
        const updatedPractice = {
            name: practice.name,
            style: practice.style,
            description: practice.description,
            sequence: practice.sequence,
            _id: practice._id
            }
        responsePractices.push(updatedPractice)
    })
    return responsePractices
}


// Create a new practice
// POST /practices  *user
router.post("/v2/practices", requireToken, (req, res, next) => {

    const practiceHolder = req.body.practice
    //give theh practice an author and assign it the user id
    practiceHolder.author = req.user._id
    
    Practice.create(practiceHolder)
        .then(practice => {
            res.status(201).json({ practice: practice }) //201: something was created on the server successfully
        })
        .catch(next)
})

// Get all practices, filtered by any arguments
// GET /practices
// /practices?style=vinyasa&length=75
router.get("/v2/practices", (req, res, next) => {
    // TODO: update this find() with { style: {$eq: <vinyasa>} etc... }
    Practice.find()
        .populate("sequence")
        .then(practices => {
            return practices.map(practice => practice)
        })
        .then(practices => {
            const responsePractices = scrubPracticeForUser(practices)
            res.status(200).json({ practices: responsePractices })
        })
        .catch(next)
})

// Get one practice
// GET /practices/:id  *user
router.get("/v2/practices/:id", requireToken, (req, res, next) => {
    Practice.findById(req.params.id)
    .populate(["author", "sequence"])
    .then(handle404)
    .then(practice => {
            res.status(200).json({ practice: practice})
        })
    .catch(next)
})

// Get all practices built by the user
// GET /practices/author (built practices) *author
// TODO: add pagination to this call
router.get("/v2/practices/author", requireToken, (req, res, next) => {
    Practice.find({ author: {$eq: req.user._id} })
    .then(handle404)
    .then(practices => {
        return practices.map(practice => practice)
    })
    .then(practices => {
        const responsePractices = scrubPracticeForUser(practices)
        res.status(200).json({ practices: responsePractices })
    })
    .catch(next)
})

// Get the user's list of favorite practices
// GET /practices/favorites *user
router.get("/v2/practices/favorites", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
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


// Update one practice
// PATCH /practices/:id *author or admin
router.patch("/v2/practices/:id", requireToken, (req, res, next) => {
    Practice.findById(req.params.id)
         .then(handle404) 
         .then(practice => {
             if(practice.author.equals(req.user._id)) {
                 console.log("Updated!")
                 return practice.updateOne(req.body.practice)
             }
             else {
                 console.log("That's not your practice to edit!")
             }
         })
         .then(() => res.sendStatus(204)) //success, no content returned
         .catch(next)
 })

//  Update the user's list of favorite practices
 // PATCH /practices/favorites *user
router.patch("/practices/favorites", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            student.favoritedPractices.push(req.body)
            return student.save()
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})
 
// Delete one practice
// DELETE /practices/:id *author or admin
router.delete("/v2/practices/:id", requireToken, (req, res, next) => {
	Practice.findById(req.params.id)
        .then(handle404) 
        .then((practice) => {
            if(practice.author.equals(req.user._id)) {
                console.log("Deleted!")
                practice.deleteOne()
            }
            else {
                console.log("That's not your practice to delete!")
            }
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})




module.exports = router