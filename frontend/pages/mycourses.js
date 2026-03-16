import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"

import Navbar from "../components/Navbar"
import { BookOpen, CheckCircle2, PlayCircle, Trophy } from "lucide-react"
import useStoredUser from "../hooks/useStoredUser"

export default function MyCourses() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const user = useStoredUser()
  const loggedIn = Boolean(user)

  useEffect(() => {
    if (!user) {
      return
    }

    axios.get(`http://localhost:5000/mycourses/${user}`)
      .then((res) => {
        setCourses(res.data)
        setLoading(false)
      })
      .catch(() => {
        alert("Error loading your courses")
        setLoading(false)
      })
  }, [user])

  const openCourse = (courseId) => {
    router.push(`/mycourses/${courseId}`)
  }

  const getStatusLabel = (course) => {
    if (course.completed) {
      return "Completed"
    }

    if ((course.progressPercent || 0) > 0) {
      return "In Progress"
    }

    return "Not Started"
  }

  return (
    <div className="min-h-screen text-white pt-28 pb-12 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <BookOpen className="text-purple-400" size={32} />
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            My Learning Journey
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : !loggedIn || courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            You haven&apos;t enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group bg-slate-800/60 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 transition-colors duration-200 flex flex-col h-full"
              >
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img
                    src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    alt={course.title}
                  />
                  <div className="absolute top-4 right-4 z-20">
                    {course.completed ? (
                      <Trophy className="text-amber-300 bg-black/50 rounded-full p-1" size={28} />
                    ) : (
                      <CheckCircle2 className="text-green-400 bg-black/50 rounded-full" size={24} />
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-5">
                    {getStatusLabel(course)}
                  </p>

                  <div className="mt-auto">
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progressPercent || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-5">
                      <p className="text-purple-300 font-medium">
                        {course.completed ? "100% Completed" : `${course.progressPercent || 0}% Completed`}
                      </p>
                      <p className="text-gray-400">
                        {Math.max((course.lastViewedPage ?? -1) + 1, 0)} / {course.totalLessons || 0} pages seen
                      </p>
                    </div>

                    <button
                      onClick={() => openCourse(course._id)}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-purple-600 border border-white/10 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      <PlayCircle size={18} />
                      {course.completed ? "Open Again" : (course.progressPercent || 0) > 0 ? "Continue Course" : "Start Course"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
