import mongoose from 'mongoose'
 async function connectToMongoDB(){
    await mongoose.connect(process.env.MONGODB_ATLAS_URL)
    .then(() => {
        console.log("MongoDB Connection Successful")
    })
    .catch((err) => {
        console.log(err)
    })
}
export default connectToMongoDB