const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {first_name,last_name,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows] = await db.query(`insert into tb_member(first_name,last_name,email,username,password,role) values(?,?,?,?,?,?)`,[first_name,last_name,email,username,hash,role])
        res.json({rows,message:"REgis Success"})

    } catch (error) {

        console.error("Error REgis",error)
        res.status(500).json({message:'Error Regis'})
        
        
    }

})


router.put('/update/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_member} = req.params
        const {first_name,last_name,email,username,password,role} = req.body

        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows] = await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,password=?,role=? where id_member=?`,[first_name,last_name,email,username,hash,role,id_member])
            res.json({rows,message:"update Success"})
        }else{
            const [rows] = await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,role=? where id_member = ?`,[first_name,last_name,email,username,role,id_member])
            res.json({rows,message:"update Success"})
        }

    } catch (error) {

        console.error("Error update",error)
        res.status(500).json({message:'Error update'})
        
        
    }

})

router.get('/showE',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_member where role= 'ผู้รับการประเมินผล' order by id_member desc`)
        res.json(rows)

    } catch (error) {

        console.error("Error get",error)
        res.status(500).json({message:'Error get'})
        
        
    }

})

router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_member where role= 'กรรมการประเมิน' order by id_member desc`)
        res.json(rows)

    } catch (error) {

        console.error("Error get",error)
        res.status(500).json({message:'Error get'})
        
        
    }

})

router.delete('/del/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_member} = req.params
        const [rows] = await db.query(`delete from tb_member where id_member = '${id_member}'`) 
        res.json(rows)
       
    } catch (error) {
        console.error("error Regis",error)
        res.status(500).json({message:'Error Regis'})
    }

})

module.exports = router