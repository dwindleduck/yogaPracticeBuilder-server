const express = require("express")
const Posture = require("../models/posture")
const router = express.Router()

const seed = [
    {
        name: "Tadasana",
        translation: "Mountain Pose",
        description: "Standing at the top of your mat",
        portionOfPractice: "opening",
        instructions: {
            breath: "Exhale",
            bandha: "Mula, Uddiyana",
            gaze: "over nose",
            mudra: "Anjali",
            timeToSpend: "one breath"
        },
        // image: {
            
        // }
    },   
    {
        name: "Urdhva Hastasana",
        translation: "Upward Salute",
        description: "arms sweep out and up",
        portionOfPractice: "opening",
        instructions: {
            breath: "Inhale",
            bandha: "Mula, Uddiyana",
            gaze: "up",
            timeToSpend: "one breath"
        },
        // image: {
            
        // }
    },
    {
        name: "Uttanasana",
        translation: "Standing Forward Fold",
        description: "bend from your hips",
        portionOfPractice: "opening",
        instructions: {
            breath: "Exhale",
            bandha: "Mula, Uddiyana",
            gaze: "down or behind",
            timeToSpend: "one breath"
        },
        // image: {
            
        // }
    },
    {
        name: "Ardha Uttanasana",
        translation: "Half Standing Forward Fold",
        description: "spine parallel to floor",
        portionOfPractice: "opening",
        instructions: {
            breath: "Inhale",
            bandha: "Mula, Uddiyana",
            gaze: "forward",
            timeToSpend: "one breath"
        },
        // image: {
            
        // }
    },
    {
        name: "Phalakasana",
        translation: "Plank Pose",
        description: "sholders over wrists, feet at the back of the mat",
        portionOfPractice: "opening",
        instructions: {
            breath: "Inhale",
            bandha: "Mula, Uddiyana",
            gaze: "forward or down",
            timeToSpend: "one breath"
        },
        // image: {
            
        // }
    }, 
    {
        name: "Chaturanga Dandasana",
        translation: "Four-Limbed Staff Pose",
        description: "half pushup, elbows stack over wrists and wrap in on the ribcage",
        portionOfPractice: "opening",
        instructions: {
            breath: "Exhale",
            bandha: "Mula, Uddiyana",
            gaze: "forward or down",
            timeToSpend: "one breath"
        },
        // image: {
            
        // }
    }, 
    {
        name: "Urdhva Mukha Svanasana",
        translation: "Upward-Facing Dog",
        description: "backbend with tops of feet on the mat",
        portionOfPractice: "opening",
        instructions: {
            breath: "Inhale",
            bandha: "Mula, Uddiyana",
            gaze: "forward or up",
            timeToSpend: "one breath"
        },
        // image: {
            
        // }
    }, 
    {
        name: "Adho Mukha Svanasana",
        translation: "Downward-Facing Dog",
        description: "press with hands, fold from hips and lift from center",
        portionOfPractice: "opening",
        instructions: {
            breath: "Exhale",
            bandha: "Mula, Uddiyana",
            gaze: "behind or at navel",
            timeToSpend: "five breaths"
        },
        // image: {
            
        // }
    }, 
]

router.get("/", (req, res, next) => {
    Posture.deleteMany({})
        .then(() => {
            Posture.create(seed)
                .then((posture) => res.status(200).json({ posture: posture }))
        })
        .catch(next)
})

module.exports = router