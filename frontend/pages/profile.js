import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import Navbar from "../components/Navbar"
import useStoredUser from "../hooks/useStoredUser"
import { PencilLine, Save, Trash2, UserRound, Mail, BookMarked, FilePenLine } from "lucide-react"

export default function Profile() {
  const router = useRouter()
  const userEmail = useStoredUser()
  const [loading, setLoading] = useState(true)
  const [savingName, setSavingName] = useState(false)
  const [deletingId, setDeletingId] = useState("")
  const [profile, setProfile] = useState(null)
  const [nameInput, setNameInput] = useState("")

  useEffect(() => {
    if (!userEmail) {
      setLoading(false)
      return
    }

    axios.get(`http://localhost:5000/profile/${encodeURIComponent(userEmail)}`)
      .then((res) => {
        setProfile(res.data)
        setNameInput(res.data.user.name)
        setLoading(false)
      })
      .catch((error) => {
        alert(error.response?.data || "Unable to load profile")
        setLoading(false)
      })
  }, [userEmail])

  const saveName = async () => {
    if (!userEmail || !nameInput.trim()) {
      alert("Name cannot be empty")
      return
    }

    setSavingName(true)
    try {
      const res = await axios.put(`http://localhost:5000/profile/${encodeURIComponent(userEmail)}`, {
        name: nameInput.trim()
      })
      setProfile((currentProfile) => ({
        ...currentProfile,
        user: res.data
      }))
      alert("Name updated successfully")
    } catch {
      alert("Failed to update name")
    } finally {
      setSavingName(false)
    }
  }

  const deleteCourse = async (courseId) => {
    if (!userEmail) {
      return
    }

    const confirmed = window.confirm("Delete this course? This will also remove related enrollments.")
    if (!confirmed) {
      return
    }

    setDeletingId(courseId)
    try {
      await axios.delete(`http://localhost:5000/courses/${courseId}`, {
        data: { email: userEmail }
      })
      setProfile((currentProfile) => ({
        ...currentProfile,
        createdCourses: currentProfile.createdCourses.filter((course) => course._id !== courseId)
      }))
    } catch {
      alert("Failed to delete course")
    } finally {
      setDeletingId("")
    }
  }

  if (!userEmail && !loading) {
    return (
      <div className="min-h-screen text-white pt-28 pb-12">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center">
            <p className="text-gray-300 mb-4">Please log in to view your profile.</p>
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-28 pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <div className="flex items-center gap-3">
          <UserRound className="text-cyan-300" size={30} />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
            Profile
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : profile ? (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-5 text-white">
                  <PencilLine size={18} />
                  <h2 className="text-xl font-semibold">Your Details</h2>
                </div>

                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
                  >
                    <Save size={18} />
                    {savingName ? "Saving..." : "Save Name"}
                  </button>
                </div>

                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/85">
                  <Mail size={16} />
                  <span>{profile.user.email}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-5 text-white">
                  <BookMarked size={18} />
                  <h2 className="text-xl font-semibold">Your Summary</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm text-gray-400">Courses Added</p>
                    <p className="mt-2 text-3xl font-bold">{profile.createdCourses.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm text-gray-400">Account Name</p>
                    <p className="mt-2 text-lg font-semibold line-clamp-2">{profile.user.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold">Courses Added By You</h2>
                <button
                  onClick={() => router.push("/addcourse")}
                  className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
                >
                  Add Another Course
                </button>
              </div>

              {profile.createdCourses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center text-gray-400">
                  You have not added any courses yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.createdCourses.map((course) => (
                    <div
                      key={course._id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="flex gap-4">
                        <img
                          src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
                          alt={course.title}
                          className="h-20 w-28 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{course.description}</p>
                          <p className="mt-3 text-xs text-cyan-200">
                            {course.lessonCount} pages • {course.enrollmentCount} enrollments
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => router.push(`/addcourse?courseId=${course._id}`)}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                        >
                          <span className="inline-flex items-center gap-2">
                            <FilePenLine size={16} />
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() => deleteCourse(course._id)}
                          disabled={deletingId === course._id}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                        >
                          <Trash2 size={16} />
                          {deletingId === course._id ? "Deleting..." : "Delete Course"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
