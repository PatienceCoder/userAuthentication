import React, { useState } from 'react';
import toast from 'react-hot-toast'
import {Link, useNavigate} from 'react-router-dom'
import '../styles/login.css'
export default function Login() {
  const navigate = useNavigate()
  const [userInput,setUserInput] = useState({email:"",password:""});
  function handleChange(e){
    setUserInput({...userInput,[e.target.name] : e.target.value})
  }
  async function handleSubmit(e){
    e.preventDefault();
    if(userInput.email === "" || userInput.password === ""){
      return toast.error("Every input field must be filled")
    }
    const callAPI = await fetch('http://127.0.0.1:4010/logincheck',{
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
    if(response.message === "Invalid email or password"){
      return toast.error("Invalid email or password")
    }
    toast.success("Login successful");
    localStorage.setItem('currentUser',JSON.stringify(response))
    navigate('/homepage')
  }
  return (
    <div className='login-container'>
      <h2>Login</h2>
        <form method='post' onSubmit={handleSubmit}>
          <label htmlFor="email">Email :</label>
          <input type="text" id='email' name='email' placeholder='johndoe@gmail.com' onChange={handleChange} />
          <label htmlFor="password">Password :</label>
          <input type="text" id='password' name='password' onChange={handleChange}/>
          <div className="routes">
            <Link to='/register'>Don't have an account ? register</Link>
            <Link to='/forgotpassword'>forgot password?</Link>
          </div>
          <button>Login</button>
        </form>
    </div>
  )
}
