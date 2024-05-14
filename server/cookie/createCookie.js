import jwt from 'jsonwebtoken'
export default function createCookie(userId,res){
    const token = jwt.sign({userId},process.env.JWTSECRETKEY,{
        expiresIn:"15d"
    })
    console.log(token)
    res.cookie("jwt",token,{
        maxAge: 9000000,
        sameSite:true
    })
}