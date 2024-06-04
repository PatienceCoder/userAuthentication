import express from 'express';
import cors from 'cors'
import connectToMongoDB from './database/connectToMongoDB.js';
import Userclass from './models/userModel.js';
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import createCookie from './cookie/createCookie.js';
const port = 4010;
dotenv.config()
const app = express();
//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin : 'http://localhost:5173',
    credentials:true
}))
app.get('/',(req,res) => {
    res.send("Hi from backend")
})
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"patiencecoder@gmail.com",
        pass:process.env.PASS
    }
})
transporter.verify((err,success)=>{
    if(err) {
        console.log(err)
    }
    else{
        console.log("Nodemailer Connection Successful")
    }
})
// THIS IS AN ENDPOINT FOR CHECKING REGISTRATION
app.post('/registrationcheck',async(req,res) => {
    const {username,email,password} = req.body
    try {
        const checkEmail =  await Userclass.findOne({email});
        if(checkEmail){
            return res.status(409).json({message:"Email already exists"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new Userclass({
            username:username,
            email:email,
            password:hashedPassword,
            otp:otp
        })
        const mailOptions = {
            from:"patiencecoder@gmail.com",
            to:email,
            subject:"OTP for Registrations",
            html: `
            <div style="background-color:#242424;color:white;padding:20px;border-radius:10px;text-align:center;">
                <p>Hi ${username}</p>
                <p>Your OTP for creating an account is ${otp}</p>
            </div>
            `
        }
        transporter.sendMail(mailOptions,(err,success)=>{
            if(err){
                console.log(err)
            }
            else{
                return res.status(200).json({message:"OTP Sent"})
            }
        })
        await newUser.save()
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

// THIS IS AN ENDPOINT FOR CHECKING THE OTP
app.post('/verificationcheck',async (req,res) => {
    const userOtp = parseInt(req.body.otp);
    try {
        const checkOtp =  await Userclass.findOne({otp:userOtp})
        if(checkOtp && checkOtp.otp!==undefined && checkOtp.otp===userOtp){
            return res.status(200).json({message:"OTP Verified"})
        }
        return res.status(400).json({error:"Incorrect OTP"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

// THIS IS AN ENDPOINT FOR CHECKING THE LOGIN
app.post('/logincheck',async (req,res) => {
    const {email,password} = req.body;
    try {
        const findMail = await Userclass.findOne({email});
        const findPassword = await bcrypt.compare(password,findMail.password);
        if(findMail && findPassword){
            const token = createCookie(findMail._id,res)
            return res.status(200).json({message:"User logged in"})
        }
        return res.status(401).json({message:"Invalid email or password"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"})
    }
})

//THIS IS AN ENDPOINT FOR SENDING AN EMAIL MESSAGE TO ALL USERS AT ONCE
app.post('/send-email',async (req,res) => {
    try {
        const users = await Userclass.find({})
        const allUsersEmail = users.map((user) => {
            const mailOptions = {
                from:"patiencecoder@gmail.com",
                to:user.email,
                subject:"Offer Alert",
                html: `
            <div style="background-color:#242424;color:white;padding:20px;border-radius:10px;text-align:center;font-size:20px;">
                <p>Hi ${user.username}👋</p>
                <p>I hope you are doing good we have an offer for you please checkout our app to know more about it 😃😃</p>
            </div>
            `
            }
            return transporter.sendMail(mailOptions)
        })
        console.log(allUsersEmail);
        await Promise.all(allUsersEmail);
        console.log(allUsersEmail)
        return res.status(200).json({message:"Email sent successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server Error"})
    }
})

//THIS IS AN ENDPOINT FOR RESETTING THE PASSWORD
app.post('/forgotpassword',async (req,res) => {
    const {email,newpassword} = req.body
    try{
        const checkMail = await Userclass.findOne({email});
        if(!checkMail){
            return res.status(401).json({message:"Email not found in our database"})
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newpassword,salt)
        checkMail.password = hashedPassword
        await checkMail.save();
        return res.status(200).json({message:"Password changed successfully"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal server error"})
    }
})

//THIS IS AN API ENDPOINT FOR LOGOUT THE USER
app.post('/logout',(req,res) => {
    try{
        res.cookie('jwt',"",{
            maxAge:0
        })
        return res.status(200).json({message:"Logged Out"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error"})
    }
})
//PORT
app.listen(port,() => {
    console.log("Server started");
    connectToMongoDB()
})