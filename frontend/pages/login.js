import { useState } from "react"
import { useRouter } from "next/router"
import Navbar from "../components/Navbar"

export default function Login(){

const router = useRouter()

const[email,setEmail]=useState("")
const[password,setPassword]=useState("")

const login=(e)=>{
e.preventDefault()

localStorage.setItem("user",email)

router.push("/")
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
onSubmit={login}
style={{
width:"320px",
display:"flex",
flexDirection:"column",
gap:"10px"
}}
>

<h2 style={{textAlign:"center"}}>Login</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={{padding:"8px"}}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={{padding:"8px"}}
/>

<button
type="submit"
style={{
background:"#16a34a",
color:"white",
border:"none",
padding:"12px",
borderRadius:"6px",
fontWeight:"bold",
cursor:"pointer"
}}
>
Login
</button>

</form>

</div>

</div>

)

}