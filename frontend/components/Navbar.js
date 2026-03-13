import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Navbar(){

const router = useRouter()
const [loggedIn,setLoggedIn] = useState(false)

useEffect(()=>{
const user = localStorage.getItem("user")
if(user){
setLoggedIn(true)
}
},[])

const logout=()=>{
localStorage.removeItem("user")
router.push("/login")
}

return(

<div style={{
background:"black",
color:"white",
padding:"18px 40px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<h2>LMS</h2>

<div style={{
display:"flex",
gap:"25px",
alignItems:"center"
}}>

<Link href="/" style={{color:"white",textDecoration:"none"}}>
Home
</Link>

{loggedIn && (
<Link href="/addcourse" style={{color:"white",textDecoration:"none"}}>
Add Course
</Link>
)}

{loggedIn && (
<Link href="/mycourses" style={{color:"white",textDecoration:"none"}}>
My Courses
</Link>
)}

{!loggedIn && (
<Link href="/login" style={{color:"white",textDecoration:"none"}}>
Login
</Link>
)}

{!loggedIn && (
<Link href="/register" style={{color:"white",textDecoration:"none"}}>
Register
</Link>
)}

{loggedIn && (
<button
onClick={logout}
style={{
background:"#2563eb",
color:"white",
border:"none",
padding:"10px 18px",
borderRadius:"6px",
cursor:"pointer"
}}
>
Logout
</button>
)}

</div>

</div>

)

}