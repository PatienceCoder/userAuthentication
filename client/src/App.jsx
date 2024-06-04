import {Toaster} from 'react-hot-toast';
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Register from './components/Register'
import Verification from './components/Verification';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Forgotpassword from './components/Forgotpassword';
import { useAuthContext } from '../authContext/authContext';
import { useEffect, useState } from 'react';
function App() {
  const {authenticatedUser} = useAuthContext();
  const [onlineStatus,setOnlineStatus] = useState(navigator.onLine);
  useEffect(() => {
    function setOnline(){
      setOnlineStatus(true)
    }
    function setOffline(){
      setOnlineStatus(false)
    }
    window.addEventListener('online',setOnline)
    window.addEventListener('offline',setOffline)
  })
  return (
    <>
    {
      !onlineStatus && (
        <div id='no-internet-connection'>
          No Internet Connection
        </div>
      )
    }
    <Routes>
        <Route path='/' element={<Register/>} />
        <Route path='/verification' element={<Verification/>} />
        <Route path='/homepage' element={<Homepage/>} />
        <Route path='/login' element={authenticatedUser ? <Homepage/> : <Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/forgotpassword' element={<Forgotpassword/>} />
    </Routes>
    <Toaster/>
    </>
  )
}
export default App
