const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows] = await db.query(`select first_name,last_name,email,username,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("Error GET Profile",err)
        res.status(500).json({message:'Error GET Profile'})
    }
})


router.put('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const {first_name,last_name,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,password=?,role=? where id_member='${id_member}'`,[first_name,last_name,email,username,hash,role])
        }else{
            await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,role=? where id_member='${id_member}'`,[first_name,last_name,email,username,role])
        }
        res.json({message:'update success'})
    } catch (error) {
        console.error("Error update",err)
        res.status(500).json({message:'Error update'})
    }
})
module.exports =router
