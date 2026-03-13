import {useEffect,useState} from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

export default function Home(){

const [courses,setCourses] = useState([])

useEffect(()=>{

axios.get("http://localhost:5000/courses")
.then(res=>setCourses(res.data))

},[])

const enroll = async(course)=>{

const user = localStorage.getItem("user")

if(!user){
alert("Please login")
return
}

await axios.post("http://localhost:5000/enroll",{

email:user,
courseId:course._id,
title:course.title

})

alert("Enrolled Successfully")

}

return(

<div>

<Navbar/>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"25px",
padding:"40px"
}}>

{courses.map(course=>(

<div key={course._id}
style={{
border:"1px solid #ddd",
borderRadius:"10px",
overflow:"hidden"
}}
>

<img
src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
style={{
width:"100%",
height:"160px",
objectFit:"cover"
}}
/>

<div style={{padding:"15px"}}>

<h3>{course.title}</h3>

<p>{course.description}</p>

<button
onClick={()=>enroll(course)}
style={{
background:"green",
color:"white",
border:"none",
padding:"10px",
borderRadius:"5px",
cursor:"pointer"
}}
>

Enroll

</button>

</div>

</div>

))}

</div>

</div>

)

}