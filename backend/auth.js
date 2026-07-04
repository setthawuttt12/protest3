const express = require('express')
const router = express.Router()
const path = require('path')
const uploadDir = require(__dirname,'../uploads/pic_user')
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
const bc = require('bcrypt')
const db = require('./db')

router.post('/regis',async()=>{

    try {
        
        const pic_user = req.files?.pic_user
        const form = json.parse(req.body.form)

        let filename = null
        if (pic_user) {
            filename = Date.now() + path.extname(pic_user.name)
            await pic_user.mv(path.join(uploadDir,filename))
        }
        const hash = await bc.hash(form.password,10)
        const [rows] = await db.query(`insert into tb_member(first_name,last_name,email,username,password,role,pic_user) values(?,?,?,?,?,?,?)`,[form.first_name,form.last_name,form.email,form.username,hash,form.role,filename])
        res.json(rows)
    } catch (error) {
        console.error("Regis Error")
        res.status(500).json({message:'Regis Error'})
    }
})

router.post('/login',async()=>{

    try {
        
        const {username,password,role} = req.body
        const [rows] = await db.query(`select * from tb_member where username=? and role=?`,[username,role])
        const m = rows[0]
        if(!m || !password || !(await bc.compare(m.password,password))){

            res.status(403).json({message:'Invalid Password'})

        }
        const token = jwt.sign(
            {id_member:m.id_member,username:m.username,role:m.role},JWT_SECRET,{expiresIn:'24h'}
        )
        res.json({token,role:m.role})
    } catch (error) {
        console.error("Regis Error")
        res.status(500).json({message:'Regis Error'})
    }
})

module.exports = router