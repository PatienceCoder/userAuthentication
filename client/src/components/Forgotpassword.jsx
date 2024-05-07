import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast'
import '../styles/forgotpassword.css'
import {Link, useNavigate} from 'react-router-dom'
export default function Forgotpassword() {
  const navigate = useNavigate()
  const [userInput,setUserInput] = useState({email:"",newpassword:""})
  function handleChange(e){
    setUserInput({...userInput,[e.target.name] : e.target.value})
  }
  async function handleSubmit(e){
    e.preventDefault();
    if(userInput.email === "" || userInput.newpassword === ""){
      return toast.error("Every input field must be filled")
    }
    const callAPI = await fetch('http://127.0.0.1:4010/forgotpassword',{
      method:"POST",
      headers: {
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify(userInput)
    })
    const response = await callAPI.json();
    if(response.error){
      return toast.error(response.error)
    }
    if(response.message === "Email not found in our database"){
      return toast.error("Email not found in our database")
    }
    toast.success("Password Changed Successfully")
    navigate('/login')
  }
  return (
    <div className='forgot-password-container'>
        <h2>Forgot Password</h2>
        <form method='post' onSubmit={handleSubmit}>
          <label htmlFor="email">Email :</label>
          <input type="text" id='email' name='email' placeholder='johndoe@gmail.com' onChange={handleChange} />
          <label htmlFor="newpassword">New Password :</label>
          <input type="text" id='newpassword' name='newpassword' onChange={handleChange}/>
          <Link to='/login'> redirect to login</Link>
          <button>Reset Password</button>
        </form>
    </div>
  )
}

