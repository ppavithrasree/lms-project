import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"

import Navbar from "../components/Navbar"
import { Mail, Lock } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async (e) => {
    e.preventDefault()
    if(!email || !password){
        alert("Please fill in all fields")
        return
    }
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password })
      localStorage.setItem("user", res.data.email)
      window.dispatchEvent(new Event("user-auth-changed"))
      alert("Login successful! Welcome back.")
      router.push("/")
    } catch (error) {
      alert(error.response?.data || "Invalid login credentials!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white flex flex-col pt-20">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/80 border border-white/20 p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Welcome Back
            </h2>
            
            <form onSubmit={login} className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <span onClick={() => router.push('/register')} className="text-blue-400 cursor-pointer hover:underline font-medium">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
