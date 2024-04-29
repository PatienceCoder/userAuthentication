import mongoose from 'mongoose'
 async function connectToMongoDB(){
    await mongoose.connect('mongodb://localhost:27017/myappusers')
    .then(() => {
        console.log("MongoDB Connection Successful")
    })
    .catch((err) => {
        console.log(err)
    })
}
export default connectToMongoDB