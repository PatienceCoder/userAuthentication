import express from 'express';
import cors from 'cors'
import connectToMongoDB from './database/connectToMongoDB.js';
import Userclass from './models/userModel.js';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
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
app.post('/registrationcheck',async(req,res) => {
    const {username,email,password} = req.body
    try {
        const checkEmail =  await Userclass.findOne({email});
        if(checkEmail){
            return res.status(409).json({message:"Email already exists"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000)
        const newUser = new Userclass({
            username:username,
            email:email,
            password:password,
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

app.listen(port,() => {
    console.log("Server started");
    connectToMongoDB()
})