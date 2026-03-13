import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LogOut, BookOpen, PlusCircle, MonitorPlay, Home } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if(user) {
      setLoggedIn(true)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4 px-4"
    >
      <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl w-full max-w-5xl px-6 py-4 flex justify-between items-center shadow-xl">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <MonitorPlay size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              LMS<span className="text-blue-500">.</span>
            </h2>
          </div>
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/">
            <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${router.pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
              <Home size={16} /> Home
            </div>
          </Link>

          {loggedIn && (
            <Link href="/addcourse">
              <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${router.pathname === '/addcourse' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                <PlusCircle size={16} /> Create
              </div>
            </Link>
          )}

          {loggedIn && (
            <Link href="/mycourses">
              <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${router.pathname === '/mycourses' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                <BookOpen size={16} /> Library
              </div>
            </Link>
          )}

          {!loggedIn && (
            <Link href="/login">
              <div className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Log in
              </div>
            </Link>
          )}

          {!loggedIn && (
            <Link href="/register">
              <div className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Sign up
              </div>
            </Link>
          )}

          {loggedIn && (
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  )
}