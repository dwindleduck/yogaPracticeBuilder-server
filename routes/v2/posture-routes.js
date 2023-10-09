const express = require("express")
const { handle404 } = require("../../lib/custom-errors")
const { requireToken, requireAdmin } = require("../../config/auth")
const Posture = require("../../models/posture")
const Student = require("../../models/student")
const router = express.Router()


const scrubPostureForUser = (postures) => {
    const responsePostures = []
    postures.forEach(posture => {
        const updatedPosture = {
              name: posture.name,
              translation: posture.translation,
              description: posture.description,
              image: posture.image,
              _id: posture._id
            }
        responsePostures.push(updatedPosture)
    })
    return responsePostures
}


// Create a new posture
// POST /postures *admin
// TODO: check for unique posture (by name?)


// Get all postures, filtered by any arguments
// GET /postures
// TODO: add pagination to this call
// /postures?portionOfPractice=standing&tags=hamstrings
router.get("/v2/postures", (req, res, next) => {
    // TODO: add arguments to this find() call like:
    // Posture.find({ 
        // portionOfPractice: {$eq: <standing>},
        // tags: 
        // etc....
    //   })
    Posture.find()
        .then(postures => {
            return postures.map(posture => posture)
        })
        .then(postures => {
            const responsePostures = scrubPostureForUser(postures)
            res.status(200).json({ postures: responsePostures })
        })
        .catch(next)
})

// Get one posture with all details
// GET /postures/:id *user
router.get("/v2/postures/:id", requireToken, (req, res, next) => {
    Posture.findById(req.params.id)
    .then(handle404)    
    .then(posture => {
            res.status(200).json({ posture: posture})
        })
    .catch(next)
})

// Get a list of the user's known postures
// GET /postures/known *user
router.get("/v2/postures/known", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .populate("knownPostures")
        .then(handle404)
        .then(student => {
            return student.knownPostures
        })
        .then(postures => {
            return postures.map(posture => posture)
        })
        .then(postures => {
            const responsePostures = scrubPostureForUser(postures)
            res.status(200).json({ postures: responsePostures })
        })
        .catch(next)
})

// Update one posture
// PATCH /postures/:id *admin
// TODO: change to requireAdmin
router.patch("/v2/postures/:id", requireToken, (req, res, next) => {
    Posture.findById(req.params.id)
        .then(handle404)
        .then(posture => {
            return posture.updateOne(req.body.posture)
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})

// Update user's list of known postures
// PATCH /postures/known *user
router.patch("/v2/postures/known", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            student.knownPostures.push(req.body)
            return student.save()
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})

// Delete one posture
// DELETE /postures/:id *admin





module.exports = router