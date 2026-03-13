const mongoose = require("mongoose")

const EnrollmentSchema = new mongoose.Schema({
userId:String,
courseId:String
})

module.exports = mongoose.model("Enrollment",EnrollmentSchema)