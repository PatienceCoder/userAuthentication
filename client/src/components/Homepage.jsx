import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Homepage() {
  const navigate = useNavigate()
  function logout(){
    navigate('/')
  }
  return (
    <div>
        <h1>Welcome to Homepage</h1>
        <button onClick={logout}>Logout</button>
    </div>
  )
}
