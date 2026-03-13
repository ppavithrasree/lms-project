import { useEffect, useState } from "react"
import axios from "axios"

import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import { BookOpen, CheckCircle2 } from "lucide-react"

export default function MyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if(!user) {
        setLoading(false)
        return
    }

    axios.get(`http://localhost:5000/mycourses/${user}`)
      .then(res => {
        setCourses(res.data)
        setLoading(false)
      })
      .catch(err => {
        alert("Error loading your courses")
        setLoading(false)
      })
  }, [])

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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <BookOpen className="text-purple-400" size={32} />
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            My Learning Journey
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            You haven't enrolled in any courses yet.
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
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/30 transition-all flex flex-col h-full"
              >
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img
                    src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={course.title}
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <CheckCircle2 className="text-green-400 bg-black/50 rounded-full" size={24} />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/3"></div>
                    </div>
                    <p className="text-xs text-purple-300 font-medium">33% Completed</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}