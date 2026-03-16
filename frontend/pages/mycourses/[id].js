import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy } from "lucide-react"

export default function CourseReader() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const enrollmentId = enrollment?._id

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    axios.get(`http://localhost:5000/course-content/${user}/${id}`)
      .then((res) => {
        setCourse(res.data.course)
        setEnrollment(res.data.enrollment)
        setCurrentPage(
          res.data.enrollment.completed
            ? 0
            : Math.max(res.data.enrollment.lastViewedPage || 0, 0)
        )
        setLoading(false)
      })
      .catch(() => {
        alert("Unable to open this course")
        router.push("/mycourses")
      })
  }, [id, router, router.isReady])

  useEffect(() => {
    if (!course || !enrollmentId) {
      return
    }

    const user = localStorage.getItem("user")
    if (!user) {
      return
    }

    axios.post(`http://localhost:5000/progress/${enrollmentId}`, {
      email: user,
      pageIndex: currentPage
    })
      .then((res) => {
        setEnrollment((prev) => ({
          ...prev,
          ...res.data
        }))
      })
      .catch(() => {})
  }, [course, enrollmentId, currentPage])

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!course || !enrollment) {
    return null
  }

  const totalPages = course.lessons.length
  const progressPercent = enrollment.progressPercent || 0
  const isCompleted = enrollment.completed

  return (
    <div className="min-h-screen text-white px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/mycourses")}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-slate-900/75 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl">
          <div className="relative h-56 md:h-72">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/70 to-transparent z-10" />
            <img
              src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
              alt={course.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-3">
                {isCompleted && <Trophy className="text-amber-300" size={24} />}
                <span className="text-xs uppercase tracking-[0.3em] text-blue-200/80">
                  {isCompleted ? "Completed" : "Active Course"}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold max-w-3xl">{course.title}</h1>
              <p className="text-sm md:text-base text-white/75 mt-3 max-w-2xl">{course.description}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
              <div>
                <p className="text-sm text-blue-200">Page {currentPage + 1} of {totalPages}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {isCompleted ? "You can revisit this course anytime. Progress will stay at 100%." : "Progress increases as you open new pages."}
                </p>
              </div>
              <div className="min-w-[220px]">
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-white/80 mt-2">
                  {isCompleted ? "Completed - 100%" : `${progressPercent}% Completed`}
                </p>
              </div>
            </div>

            <div className="min-h-[320px] md:min-h-[380px] rounded-3xl border border-white/10 bg-black/20 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70 mb-4">
                Lesson {currentPage + 1}
              </p>
              <p className="text-lg leading-8 text-slate-100 whitespace-pre-wrap">
                {course.lessons[currentPage]}
              </p>
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                disabled={currentPage === 0}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/15"
              >
                <ChevronLeft size={18} />
                Prev
              </button>

              <button
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 border border-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500"
              >
                {currentPage === totalPages - 1 ? "Done" : "Next"}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
