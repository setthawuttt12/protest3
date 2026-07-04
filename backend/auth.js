const express = require('express')
const db = require('./db')
const path = require('path')
const bc = require('bcrypt')
const uploadDir = path.join(__dirname,'./uploads/pic_user')
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')

router.post('/regis',async(req,res)=>{

    try {
        
        const form = JSON.parse(req.body.form)
        const pic_user = req.files?.pic_user

        let filename  = null

        if (pic_user) {
            filename = Date.now() + path.extname(pic_user.name)
            await pic_user.mv(path.join(uploadDir,filename))
        }
        const hash = await bc.hash(form.password,10)
        const [rows] = await db.query(`insert into tb_member(first_name,last_name,email,username,password,role,pic_user) values(?,?,?,?,?,?,?)`,[form.first_name,form.last_name,form.email,form.username,hash,form.role,filename])
        res.json({rows,message:"REgis Success"})

    } catch (error) {

        console.error("Error REgis",error)
        res.status(500).json({message:'Error Regis'})
        
        
    }

})


router.post('/login',async(req,res)=>{

    try {
        
        const {username,password,role} = req.body
        const [rows] = await db.query(`select * from tb_member where username = ? and role = ? `,[username,role])
        const m = rows[0]
        if(!m || !password || !(await bc.compare(password,m.password))){
            res.status(403).json({message:'รหัสผ่านไม่ถูกต้อง'})
        }
        const token = jwt.sign(
            {id_member:m.id_member,username:m.username,role:m.role},JWT_SECRET,{expiresIn:'24h'}
        )
        res.json({token,role:m.role})

    } catch (error) {

        console.error("Error Login",error)
        res.status(500).json({message:'Error Login'})
        
        
    }

})

module.exports = router