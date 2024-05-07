import {Toaster} from 'react-hot-toast';
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Register from './components/Register'
import Verification from './components/Verification';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Forgotpassword from './components/Forgotpassword';

function App() {
 
  return (
    <>
    <Routes>
        <Route path='/' element={<Register/>} />
        <Route path='/verification' element={<Verification/>} />
        <Route path='/homepage' element={<Homepage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/forgotpassword' element={<Forgotpassword/>} />
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
