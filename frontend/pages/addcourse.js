import {useState} from "react"
import axios from "axios"
import Navbar from "../components/Navbar"

export default function AddCourse(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [image,setImage] = useState("")

const addCourse = async(e)=>{

e.preventDefault()

await axios.post("http://localhost:5000/addcourse",{

title,
description,
image

})

alert("Course Added")

}

return(

<div>

<Navbar/>

<div style={{
display:"flex",
justifyContent:"center",
marginTop:"100px"
}}>

<form
onSubmit={addCourse}
style={{
width:"300px",
display:"flex",
flexDirection:"column",
gap:"10px"
}}
>

<h2>Add Course</h2>

<input
placeholder="Title"
onChange={e=>setTitle(e.target.value)}
/>

<input
placeholder="Description"
onChange={e=>setDescription(e.target.value)}
/>


<button style={{
background:"purple",
color:"white",
padding:"10px",
border:"none"
}}>

Add Course

</button>

</form>

</div>

</div>

)

}