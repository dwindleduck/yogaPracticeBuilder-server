// Server Side Command Center
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const requestLogger = require("./lib/request-logger")
require("dotenv").config()
const db = require("./config/db")
const PORT = process.env.PORT || 8000

const seed = require("./lib/seed")
const v1_studentRoutes = require("./routes/v1/student-routes")
const v1_postureRoutes = require("./routes/v1/posture-routes")
const v1_practiceRoutes = require("./routes/v1/practice-routes")
const v2_studentRoutes = require("./routes/v2/student-routes")
const v2_postureRoutes = require("./routes/v2/posture-routes")
const v2_practiceRoutes = require("./routes/v2/practice-routes")

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

app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://127.0.0.1:5500` }))
app.use(requestLogger)

app.use("/seed", seed)
app.use(v1_studentRoutes)
app.use(v1_postureRoutes)
app.use(v1_practiceRoutes)
app.use(v2_studentRoutes)
app.use(v2_postureRoutes)
app.use(v2_practiceRoutes)

app.listen(PORT, () => {
    console.log("listening on port " + PORT)
})

module.exports = app