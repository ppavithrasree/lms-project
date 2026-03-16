const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://maripallygautam_db_user:jjGOQ97yiLlSN04k@cluster0.hpczuxx.mongodb.net/lms?appName=Cluster0")

const buildSampleLessons = (title, description) => {
  const courseTitle = title || "This course"
  const summary = description || `${courseTitle} is designed to guide learners step by step.`

  return [
    `Welcome to ${courseTitle}. This course opens with a clear overview of what you will build, why the topic matters, and how the lessons connect to one another. ${summary}`,
    `${courseTitle} starts with the foundation. In this section, focus on the core ideas, the main vocabulary, and the practical goal of the course so the later lessons feel easier to follow.`,
    `Now move into the workflow for ${courseTitle}. Think about the order of actions, the tools you need, and the common mistakes learners make when they rush through the basics.`,
    `This lesson explains how to apply ${courseTitle} in a realistic situation. Read it slowly, connect it with the earlier concepts, and notice how the pieces start working together.`,
    `Every strong learner revises. In ${courseTitle}, this section is about checking your understanding, repeating the most important ideas, and identifying areas that need one more pass.`,
    `You are at the final part of ${courseTitle}. Use this page as a summary: review the main points, remember the sequence you followed, and keep returning to the course whenever you want a refresher.`
  ]
}

const sanitizeLessons = (lessons) => (
  Array.isArray(lessons)
    ? lessons.map((lesson) => `${lesson || ""}`.trim()).filter(Boolean)
    : []
)

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String
})

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  createdByEmail: String,
  lessons: {
    type: [String],
    default: []
  }
})

const EnrollmentSchema = new mongoose.Schema({
  email: String,
  courseId: String,
  title: String,
  image: String,
  lastViewedPage: {
    type: Number,
    default: -1
  },
  progressPercent: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  totalLessons: {
    type: Number,
    default: 0
  }
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema)
const Enroll = mongoose.models.Enroll || mongoose.model("Enroll", EnrollmentSchema)

const getStoredLessons = async (course) => {
  const cleanedLessons = sanitizeLessons(course.lessons)
  if (cleanedLessons.length > 0) {
    return cleanedLessons
  }

  const seededLessons = buildSampleLessons(course.title, course.description)
  await Course.updateOne(
    { _id: course._id },
    { $set: { lessons: seededLessons } }
  )

  return seededLessons
}

const backfillCourseLessons = async () => {
  const courses = await Course.find().lean()

  await Promise.all(
    courses.map(async (course) => {
      const updates = {}
      const lessons = sanitizeLessons(course.lessons)

      if (lessons.length === 0) {
        updates.lessons = buildSampleLessons(course.title, course.description)
      }

      if (!course.createdByEmail) {
        updates.createdByEmail = ""
      }

      if (Object.keys(updates).length > 0) {
        await Course.updateOne({ _id: course._id }, { $set: updates })
      }
    })
  )
}

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB Atlas")
  await backfillCourseLessons()
})

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).send("Please fill in all fields")
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).send("Email is already registered")
  }

  const user = new User({
    name,
    email,
    password
  })

  await user.save()

  res.send("Registered")
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email, password })

  if (!user) {
    return res.status(401).send("Invalid Login")
  }

  res.json(user)
})

app.get("/profile/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).lean()
  if (!user) {
    return res.status(404).send("User not found")
  }

  const createdCourses = await Course.find({ createdByEmail: req.params.email }).sort({ _id: -1 }).lean()
  const enrichedCourses = await Promise.all(
    createdCourses.map(async (course) => {
      const lessons = await getStoredLessons(course)
      const enrollments = await Enroll.countDocuments({ courseId: `${course._id}` })

      return {
        ...course,
        lessons,
        lessonCount: lessons.length,
        enrollmentCount: enrollments
      }
    })
  )

  res.json({
    user: {
      name: user.name,
      email: user.email
    },
    createdCourses: enrichedCourses
  })
})

app.put("/profile/:email", async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).send("Name is required")
  }

  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { $set: { name } },
    { new: true }
  ).lean()

  if (!user) {
    return res.status(404).send("User not found")
  }

  res.json({
    name: user.name,
    email: user.email
  })
})

app.post("/addcourse", async (req, res) => {
  const { title, description, image, lessons, createdByEmail } = req.body
  const cleanedLessons = sanitizeLessons(lessons)

  if (!title || !description || cleanedLessons.length === 0 || !createdByEmail) {
    return res.status(400).send("Title, description, course pages, and creator are required")
  }

  const user = await User.findOne({ email: createdByEmail }).lean()
  if (!user) {
    return res.status(404).send("Creator not found")
  }

  const course = new Course({
    title,
    description,
    image,
    createdByEmail,
    lessons: cleanedLessons
  })

  await course.save()

  res.send("Course Added")
})

app.put("/courses/:courseId", async (req, res) => {
  const { email, title, description, image, lessons } = req.body
  const cleanedLessons = sanitizeLessons(lessons)

  if (!email || !title || !description || cleanedLessons.length === 0) {
    return res.status(400).send("Course details are incomplete")
  }

  const course = await Course.findOneAndUpdate(
    { _id: req.params.courseId, createdByEmail: email },
    {
      $set: {
        title,
        description,
        image,
        lessons: cleanedLessons
      }
    },
    { new: true }
  ).lean()

  if (!course) {
    return res.status(404).send("Course not found")
  }

  await Enroll.updateMany(
    { courseId: req.params.courseId },
    {
      $set: {
        title: course.title,
        image: course.image,
        totalLessons: cleanedLessons.length
      }
    }
  )

  res.json(course)
})

app.delete("/courses/:courseId", async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).send("Email is required")
  }

  const deletedCourse = await Course.findOneAndDelete({
    _id: req.params.courseId,
    createdByEmail: email
  }).lean()

  if (!deletedCourse) {
    return res.status(404).send("Course not found")
  }

  await Enroll.deleteMany({ courseId: req.params.courseId })

  res.send("Course deleted")
})

app.get("/courses", async (req, res) => {
  const courses = await Course.find().sort({ _id: -1 }).lean()

  const coursesWithLessons = await Promise.all(
    courses.map(async (course) => {
      const lessons = await getStoredLessons(course)

      return {
        ...course,
        lessons,
        lessonCount: lessons.length
      }
    })
  )

  res.json(coursesWithLessons)
})

app.get("/courses/:courseId", async (req, res) => {
  const course = await Course.findById(req.params.courseId).lean()

  if (!course) {
    return res.status(404).send("Course not found")
  }

  const lessons = await getStoredLessons(course)

  res.json({
    ...course,
    lessons,
    lessonCount: lessons.length
  })
})

app.post("/enroll", async (req, res) => {
  const { email, courseId } = req.body

  const existingEnrollment = await Enroll.findOne({ email, courseId })
  if (existingEnrollment) {
    return res.status(409).send("Already enrolled")
  }

  const course = await Course.findById(courseId).lean()
  if (!course) {
    return res.status(404).send("Course not found")
  }

  const lessons = await getStoredLessons(course)

  const enroll = new Enroll({
    email,
    courseId,
    title: course.title,
    image: course.image,
    totalLessons: lessons.length
  })

  await enroll.save()

  res.send("Enrolled")
})

app.get("/mycourses/:email", async (req, res) => {
  const enrollments = await Enroll.find({ email: req.params.email }).sort({ _id: -1 }).lean()

  const courses = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await Course.findById(enrollment.courseId).lean()
      if (!course) {
        return null
      }

      const lessons = await getStoredLessons(course)
      const totalLessons = lessons.length
      const lastViewedPage = enrollment.lastViewedPage ?? -1
      const seenLessons = Math.min(totalLessons, lastViewedPage + 1)
      const progressPercent = totalLessons === 0 ? 0 : Math.round((seenLessons / totalLessons) * 100)
      const completed = seenLessons === totalLessons

      if (
        enrollment.totalLessons !== totalLessons ||
        enrollment.title !== course.title ||
        enrollment.image !== course.image ||
        enrollment.progressPercent !== progressPercent ||
        enrollment.completed !== completed
      ) {
        await Enroll.updateOne(
          { _id: enrollment._id },
          {
            $set: {
              title: course.title,
              image: course.image,
              totalLessons,
              progressPercent,
              completed
            }
          }
        )
      }

      return {
        ...enrollment,
        title: course.title,
        image: course.image,
        totalLessons,
        progressPercent,
        completed
      }
    })
  )

  res.json(courses.filter(Boolean))
})

app.get("/course-content/:email/:enrollmentId", async (req, res) => {
  const enrollment = await Enroll.findOne({
    _id: req.params.enrollmentId,
    email: req.params.email
  }).lean()

  if (!enrollment) {
    return res.status(404).send("Enrollment not found")
  }

  const course = await Course.findById(enrollment.courseId).lean()
  if (!course) {
    return res.status(404).send("Course not found")
  }

  const lessons = await getStoredLessons(course)

  if (enrollment.totalLessons !== lessons.length) {
    await Enroll.updateOne(
      { _id: enrollment._id },
      { $set: { totalLessons: lessons.length } }
    )
    enrollment.totalLessons = lessons.length
  }

  res.json({
    enrollment,
    course: {
      ...course,
      lessons
    }
  })
})

app.post("/progress/:enrollmentId", async (req, res) => {
  const { email, pageIndex } = req.body

  const enrollment = await Enroll.findOne({
    _id: req.params.enrollmentId,
    email
  })

  if (!enrollment) {
    return res.status(404).send("Enrollment not found")
  }

  const course = await Course.findById(enrollment.courseId).lean()
  if (!course) {
    return res.status(404).send("Course not found")
  }

  const lessons = await getStoredLessons(course)
  const totalLessons = lessons.length

  if (typeof pageIndex !== "number" || pageIndex < 0 || pageIndex >= totalLessons) {
    return res.status(400).send("Invalid page index")
  }

  const lastViewedPage = Math.max(enrollment.lastViewedPage ?? -1, pageIndex)
  const seenLessons = Math.min(totalLessons, lastViewedPage + 1)
  const progressPercent = totalLessons === 0 ? 0 : Math.round((seenLessons / totalLessons) * 100)
  const completed = seenLessons === totalLessons

  enrollment.lastViewedPage = lastViewedPage
  enrollment.totalLessons = totalLessons
  enrollment.progressPercent = progressPercent
  enrollment.completed = completed

  await enrollment.save()

  res.json({
    lastViewedPage,
    totalLessons,
    progressPercent,
    completed
  })
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})
