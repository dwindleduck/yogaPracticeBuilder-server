const express = require("express")
const { handle404 } = require("../../lib/custom-errors")
const { requireToken } = require("../../config/auth")
const { requireAdmin } = require("../../lib/requireAdmin")
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
router.post("/v2/postures", [requireToken, requireAdmin], (req, res, next) => {
        Posture.create(req.body.posture)
            .then(posture => {
                res.status(201).json({ posture: posture }) //201: something was created on the server successfully
            })
            .catch(next)
})

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

// Add or remove a posture from the list of known postures
// PATCH /postures/known *user
router.patch("/v2/postures/known", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            // Check if the posture is already in the list
            if(student.knownPostures.includes(req.body.posture)){
                //remove from list
                student.knownPostures.pop(req.body.posture)
            }
            else {
                //add to list
                student.knownPostures.push(req.body.posture)
            }
            return student.save()
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})

// Update one posture
// PATCH /postures/:id *admin
router.patch("/v2/postures/:id", [requireToken, requireAdmin], (req, res, next) => {
    Posture.findById(req.params.id)
        .then(handle404)
        .then(posture => {
            return posture.updateOne(req.body.posture)
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})

// Delete one posture
// DELETE /postures/:id *admin
router.delete("/v2/postures/:id", [requireToken, requireAdmin], (req, res, next) => {
	Posture.findById(req.params.id)
        .then(handle404) 
        .then((posture) => {
            posture.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})


module.exports = router