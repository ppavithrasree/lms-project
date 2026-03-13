import { useEffect, useState } from "react"
import axios from "axios"

import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import { GraduationCap, Clock } from "lucide-react"

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("http://localhost:5000/courses")
      .then(res => {
        setCourses(res.data)
        setLoading(false)
      })
      .catch(err => {
        alert("Failed to load courses")
        setLoading(false)
      })
  }, [])

  const enroll = async (course) => {
    const user = localStorage.getItem("user")
    
    if(!user) {
      alert("Please login to enroll!")
      return
    }

    try {
      await axios.post("http://localhost:5000/enroll", {
        email: user,
        courseId: course._id,
        title: course.title
      })
      alert(`Successfully enrolled in ${course.title}!`)
    } catch (error) {
      alert("Enrollment failed. Maybe you are already enrolled?")
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen text-white pt-28 pb-12 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Expand Your Horizons
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Discover world-class courses taught by industry experts. Join our growing community of lifelong learners today.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No courses available right now.
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map(course => (
              <motion.div 
                variants={item}
                key={course._id} 
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-slate-800/60 backdrop-blur-[2px] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img
                    src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={course.title}
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="bg-blue-600/80 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full text-white flex items-center gap-1">
                      <GraduationCap size={14} /> New
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-white line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock size={14} /> Self-Paced
                    </div>
                  </div>

                  <button
                    onClick={() => enroll(course)}
                    className="w-full bg-white/10 hover:bg-blue-600 border border-white/10 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/50"
                  >
                    Enroll Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}