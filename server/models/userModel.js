import mongoose from 'mongoose'

const userModel = new mongoose.Schema({
    username:{type:String},
    email:{type:String},
    password:{type:String},
    otp:{type:Number}
})

const Userclass = mongoose.model('users',userModel);
export default Userclass