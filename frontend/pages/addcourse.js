import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"

import Navbar from "../components/Navbar"
import { FileText, Image as ImageIcon, Type, PlusCircle, NotebookText, XCircle } from "lucide-react"
import useStoredUser from "../hooks/useStoredUser"

export default function AddCourse() {
  const router = useRouter()
  const user = useStoredUser()
  const { courseId } = router.query
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [lessons, setLessons] = useState([""])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const isEditMode = Boolean(courseId)

  useEffect(() => {
    if (!router.isReady || !courseId || !user) {
      return
    }

    setPageLoading(true)
    axios.get(`http://localhost:5000/courses/${courseId}`)
      .then((res) => {
        if (res.data.createdByEmail !== user) {
          alert("You can edit only your own courses.")
          router.push("/profile")
          return
        }

        setTitle(res.data.title || "")
        setDescription(res.data.description || "")
        setImage(res.data.image || "")
        setLessons(res.data.lessons?.length ? res.data.lessons : [""])
      })
      .catch((error) => {
        alert(error.response?.data || "Unable to load course for editing")
        router.push("/profile")
      })
      .finally(() => {
        setPageLoading(false)
      })
  }, [courseId, router, router.isReady, user])

  const updateLesson = (index, value) => {
    setLessons((currentLessons) => currentLessons.map((lesson, lessonIndex) => (
      lessonIndex === index ? value : lesson
    )))
  }

  const addLessonField = () => {
    setLessons((currentLessons) => [...currentLessons, ""])
  }

  const removeLessonField = (index) => {
    setLessons((currentLessons) => currentLessons.filter((_, lessonIndex) => lessonIndex !== index))
  }

  const saveCourse = async (e) => {
    e.preventDefault()

    const filledLessons = lessons.map((lesson) => lesson.trim()).filter(Boolean)

    if (!title || !description) {
      alert("Title and Description are required!")
      return
    }

    if (filledLessons.length === 0) {
      alert("Add at least one course page.")
      return
    }

    if (!user) {
      alert("Please login to create a course.")
      return
    }

    setLoading(true)
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/courses/${courseId}`, {
          email: user,
          title,
          description,
          image,
          lessons: filledLessons
        })
        alert("Course updated successfully!")
        router.push("/profile")
      } else {
        await axios.post("http://localhost:5000/addcourse", {
          title,
          description,
          image,
          lessons: filledLessons,
          createdByEmail: user
        })
        alert("Course Created Successfully!")
        router.push("/")
      }
    } catch (error) {
      alert(error.response?.data || (isEditMode ? "Failed to update course." : "Failed to add course."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white flex flex-col pt-28 pb-12">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="bg-slate-800/80 border border-white/20 p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              {isEditMode ? "Edit Course" : "Create a New Course"}
            </h2>

            {pageLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
            <form onSubmit={saveCourse} className="space-y-6">
              <div className="relative group">
                <Type className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  placeholder="Course Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <FileText className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <textarea
                  rows="4"
                  placeholder="Course Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium resize-none"
                />
              </div>

              <div className="relative group">
                <ImageIcon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  placeholder="Image URL (optional)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
              </div>

              {image && (
                <div className="rounded-xl overflow-hidden h-32 w-full border border-white/10">
                  <img src={image} className="w-full h-full object-cover" alt="Preview" onError={(e) => { e.target.style.display = "none" }} />
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <NotebookText className="text-cyan-300" size={20} />
                  <div>
                    <p className="font-semibold text-white">Course Pages</p>
                    <p className="text-sm text-gray-400">Each text box becomes one page in the enrolled course.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white/80">Page {index + 1}</p>
                        {lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLessonField(index)}
                            className="inline-flex items-center gap-1 text-sm text-red-300 hover:text-red-200"
                          >
                            <XCircle size={16} />
                            Cancel
                          </button>
                        )}
                      </div>
                      <textarea
                        rows="4"
                        placeholder={`Page ${index + 1} content`}
                        value={lesson}
                        onChange={(e) => updateLesson(index, e.target.value)}
                        className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all resize-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addLessonField}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
                >
                  <PlusCircle size={18} />
                  Add+
                </button>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {loading ? (isEditMode ? "Saving..." : "Publishing...") : (isEditMode ? "Save Changes" : "Publish Course")}
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
