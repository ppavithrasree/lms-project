import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"

import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import { FileText, Image as ImageIcon, Type } from "lucide-react"

export default function AddCourse() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)

  const addCourse = async (e) => {
    e.preventDefault()
    
    if(!title || !description){
        alert("Title and Description are required!")
        return
    }

    setLoading(true)
    try {
      await axios.post("http://localhost:5000/addcourse", { title, description, image })
      alert("Course Created Successfully!")
      router.push('/')
    } catch (error) {
      alert("Failed to add course.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white flex flex-col pt-28">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="bg-slate-800/80 border border-white/20 p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Create a New Course
            </h2>
            
            <form onSubmit={addCourse} className="space-y-6">
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
                    <img src={image} className="w-full h-full object-cover" alt="Preview" onError={(e) => e.target.style.display='none'} />
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Course"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}