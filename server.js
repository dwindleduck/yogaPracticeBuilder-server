// Server Side Command Center
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const requestLogger = require("./lib/request-logger")
require("dotenv").config()
const db = require("./config/db")
const PORT = process.env.PORT || 8000

const seed = require("./lib/seed")
const studentRoutes = require("./routes/student-routes")
const postureRoutes = require("./routes/posture-routes")
const practiceRoutes = require("./routes/practice-routes")

// deprecation warning
mongoose.set("strictQuery", true)

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const connectedDb = mongoose.connection

connectedDb.on('connected', function () {
    console.log(`Connected to ${connectedDb.name} at ${connectedDb.host}:${connectedDb.port}`);
  });

const app = express()

// app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5500" }))
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://127.0.0.1:5500` }))
app.use(requestLogger)

app.use("/seed", seed)
app.use(studentRoutes)
app.use(postureRoutes)
app.use(practiceRoutes)

app.listen(PORT, () => {
    console.log("listening on port " + PORT)
})

module.exports = app