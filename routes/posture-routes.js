const express = require("express")
const { handle404 } = require("../lib/custom-errors")
const { requireToken } = require('../config/auth')
const Posture = require("../models/posture")
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




//Index
//GET /postures
router.get("/postures", (req, res, next) => {
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

//Index by portionOfPractice
//GET /postures/portion/:portionOfPractice
router.get("/postures/portion/:portionOfPractice", requireToken, (req, res, next) => {
    Posture.find({ portionOfPractice: {$eq: req.params.portionOfPractice} })
        .then(postures => {
            return postures.map(posture => posture)
        })
        .then(postures => {
            const responsePostures = scrubPostureForUser(postures)
            res.status(200).json({ postures: responsePostures })
        })
        .catch(next)
})








//Posture by Id
//Get /postures/:id
router.get("/postures/:id", requireToken, (req, res, next) => {
    Posture.findById(req.params.id)
    .then(handle404)    
    .then(posture => {
            res.status(200).json({ posture: posture})
        })
    .catch(next)
})





module.exports = router