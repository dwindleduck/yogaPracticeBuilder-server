const express = require("express")
const { handle404 } = require("../../lib/custom-errors")
const { requireToken } = require("../../config/auth")
const Practice = require("../../models/practice")
const Student = require("../../models/student")
const router = express.Router()
// const mongoosePaginate = require('mongoose-paginate');


const scrubPracticesForUser = (practices) => {
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
    //give the practice an author and assign it the user id
    practiceHolder.author = req.user._id
    
    Practice.create(practiceHolder)
        .then(practice => {
            res.status(201).json({ practice: practice }) //201: something was created on the server successfully
        })
        .catch(next)
})


// ********************************************************
// ********************************************************
// ********************************************************
// ********************************************************

// Without pagination
// Get all practices, filtered by any arguments
// GET /practices
// /practices?style=vinyasa&length=75
// TODO: add pagination to this call
// router.get("/v2/practices", (req, res, next) => {
//     // TODO: update this find() with { style: {$eq: <vinyasa>} etc... }
//     Practice.find()
//         .populate("sequence")
//         .then(practices => {
//             return practices.map(practice => practice)
//         })
//         .then(practices => {
//             const responsePractices = scrubPracticeForUser(practices)
//             res.status(200).json({ practices: responsePractices })
//         })
//         .catch(next)
// })



// GET /practices -- With Pagination
// Get all practices, filtered by any arguments
// /practices?style=vinyasa&length=75
router.get("/v2/practices", (req, res, next) => {
    const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
    const pageSize = 10; // Number of items per page

    // TODO: update the {} with style: {$eq: <vinyasa>} etc...
    Practice.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error occurred while fetching practices.' });

        const { docs, total, limit, page, pages } = result;
        const responsePractices = scrubPracticesForUser(docs)
        res.json({ practices: responsePractices, total, limit, page, pages });
    })
    .catch(next)
})

// ********************************************************
// ********************************************************
// ********************************************************
// ********************************************************


// Without pagination
// Get all practices built by the user
// GET /practices/author (built practices) *author
// TODO: add pagination to this call
// router.get("/v2/practices/author", requireToken, (req, res, next) => {
//     Practice.find({ author: {$eq: req.user._id} })
//     .then(handle404)
//     .then(practices => {
//         return practices.map(practice => practice)
//     })
//     .then(practices => {
//         const responsePractices = scrubPracticesForUser(practices)
//         res.status(200).json({ practices: responsePractices })
//     })
//     .catch(next)
// })



// GET /practices/author (built practices) *author -- With Pagination
// Get all practices built by the user
// /practices?style=vinyasa&length=75
router.get("/v2/practices/author", requireToken, (req, res, next) => {
    const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
    const pageSize = 10; // Number of items per page

    // TODO: update the {} with style: {$eq: <vinyasa>} etc...
    Practice.paginate({ author: {$eq: req.user._id} }, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error occurred while fetching practices.' });

        const { docs, total, limit, page, pages } = result;
        const responsePractices = scrubPracticesForUser(docs)
        res.json({ practices: responsePractices, total, limit, page, pages })
    })
    .catch(next)
})

// ********************************************************
// ********************************************************
// ********************************************************
// ********************************************************


// Without pagination
// Get the user's list of favorite practices
// GET /practices/favorites *user
// TODO: add pagination to this call
// router.get("/v2/practices/favorites", requireToken, (req, res, next) => {
//     Student.findById(req.user._id)
//         .populate("favoritedPractices")
//         .then(handle404)
//         .then(student => {
//             return student.favoritedPractices
//         })
//         .then(practices => {
//             return practices.map(practice => practice)
//         })
//         .then(practices => {
//             const responsePractices = scrubPracticesForUser(practices)
//             res.status(200).json({ practices: responsePractices })
//         })
//         .catch(next)
// })


// With pagination
// Get the user's list of favorite practices
// GET /practices/favorites *user
router.get("/v2/practices/favorites", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            return student.favoritedPractices
        })
        .then(practices => {
            const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
            const pageSize = 10; // Number of items per page

            Practice.paginate({ _id: {$in: practices} }, { page: pageNumber, limit: pageSize }, (err, result) => {
                if (err) return res.status(500).json({ message: 'Error occurred while fetching practices.' });

                const { docs, total, limit, page, pages } = result;
                const responsePractices = scrubPracticesForUser(docs)
                res.json({ practices: responsePractices, total, limit, page, pages });
            })
            .catch(next)
        })
        .catch(next)
})


// ********************************************************
// ********************************************************
// ********************************************************
// ********************************************************







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

// Update the user's list of favorite practices
// PATCH /practices/favorites *user
router.patch("/v2/practices/favorites", requireToken, (req, res, next) => {
    Student.findById(req.user._id)
        .then(handle404)
        .then(student => {
            console.log(student.favoritedPractices)


            if(student.favoritedPractices.includes(req.body.practice)){
                // remove from list
                student.favoritedPractices.pop(req.body.practice)
            }
            else{
                // add to list
                student.favoritedPractices.push(req.body.practice)
            }
            return student.save()
        })
        .then(() => res.sendStatus(204)) //success, no content returned
        .catch(next)
})

// Update one practice
// PATCH /practices/:id *author or admin
router.patch("/v2/practices/:id", requireToken, (req, res, next) => {
    Practice.findById(req.params.id)
         .then(handle404) 
         .then(practice => {
            //if the user is the author, update the practice
             if(practice.author.equals(req.user._id)) {
                 return practice.updateOne(req.body.practice)
             }
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
            // if the user is the author, delete the practice
            if(practice.author.equals(req.user._id)) {
                practice.deleteOne()
            }
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})


module.exports = router