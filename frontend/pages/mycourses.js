import { useEffect,useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

export default function MyCourses(){

const[courses,setCourses]=useState([])

useEffect(()=>{

const user = localStorage.getItem("user")

axios.get(`http://localhost:5000/mycourses/${user}`)
.then(res=>setCourses(res.data))

},[])

return(

<div>

<Navbar/>

<h2 style={{margin:"20px"}}>My Courses</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"20px",
padding:"20px"
}}>

{courses.map(course=>(

<div key={course._id}
style={{
border:"1px solid #ccc",
borderRadius:"10px",
padding:"15px"
}}
>

<img
src={course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
style={{width:"100%",height:"160px",objectFit:"cover"}}
/>

<h3>{course.title}</h3>

<p>{course.description}</p>

</div>

))}

</div>

</div>

)

}