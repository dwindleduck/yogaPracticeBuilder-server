// Require the needed npm packages
const passport = require("passport")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const secret = process.env.JWT_SECRET || "some string value only your app knows"
const { Strategy, ExtractJwt } = require("passport-jwt")

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: secret,
}

const Student = require("../models/student")

const strategy = new Strategy(opts, function (jwt_payload, done) {
	Student.findById(jwt_payload.id)
		.then((student) => done(null, student))
		.catch((err) => done(err))
})

passport.use(strategy)
passport.initialize()

//ensures the user is logged in (has a token)
const requireToken = passport.authenticate("jwt", { session: false })

const createStudentToken = (req, student) => {
	if (
		!student ||
		!req.body.credentials.password ||
		!bcrypt.compareSync(req.body.credentials.password, student.password)
	) {
		const err = new Error("The provided username or password is incorrect")
		err.statusCode = 422
		throw err
	}
	return jwt.sign({ id: student._id }, secret, { expiresIn: 36000 })
}


module.exports = {
	requireToken,
	createStudentToken,
}
