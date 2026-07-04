const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

exports.verifyToken = (req,res,next)=>{
    const authHeader = req.header("Authotization")
    if(!authHeader || !authHeader.starsWith("Bearer")) return
    res.status(401).json({message:'Invalid No or token'})
    try {
        req.user = jwt.verify(token,JWT_SECRET)
        next()
    } catch (error) {
        console.error('Invalid Token',error)
        res.status(403).json({message:'Invalidr token'})
    }
}

exports.requierRole = (role) =>(req,res,next)=>{
    req.user?.role === role
    ? next()
    : res.status(403).json({message:'Invalidr token'})
}