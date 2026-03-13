const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://maripallygautam_db_user:jjGOQ97yiLlSN04k@cluster0.hpczuxx.mongodb.net/lms?appName=Cluster0")

// USER MODEL
const User = mongoose.model("User",{
name:String,
email:String,
password:String
})

// COURSE MODEL
const Course = mongoose.model("Course",{
title:String,
description:String,
image:String
})

// ENROLL MODEL
const Enroll = mongoose.model("Enroll",{
email:String,
courseId:String,
title:String
})


// REGISTER
app.post("/register",async(req,res)=>{

const {name,email,password}=req.body

const user = new User({
name,
email,
password
})

await user.save()

res.send("Registered")

})


// LOGIN
app.post("/login",async(req,res)=>{

const {email,password} = req.body

const user = await User.findOne({email,password})

if(!user){
return res.status(401).send("Invalid Login")
}

res.json(user)

})


// ADD COURSE
app.post("/addcourse",async(req,res)=>{

const {title,description,image} = req.body

const course = new Course({
title,
description,
image
})

await course.save()

res.send("Course Added")

})


// GET COURSES
app.get("/courses",async(req,res)=>{

const courses = await Course.find()

res.json(courses)

})


// ENROLL COURSE
app.post("/enroll",async(req,res)=>{

const {email,courseId,title} = req.body

const enroll = new Enroll({
email,
courseId,
title
})

await enroll.save()

res.send("Enrolled")

})


// MY COURSES
app.get("/mycourses/:email",async(req,res)=>{

const courses = await Enroll.find({email:req.params.email})

res.json(courses)

})


app.listen(5000,()=>{

console.log("Server running on port 5000")

})