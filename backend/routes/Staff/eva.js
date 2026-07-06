const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_member,id_sys,day_eva,status_eva} = req.body
        const [rows] = await db.query(`insert into tb_eva(id_member,id_sys,day_eva,status_eva) values(?,?,?,?)`,[id_member,id_sys,day_eva,1])
        res.json({rows,message:"REgis Success"})

    } catch (error) {

        console.error("Error REgis",error)
        res.status(500).json({message:'Error Regis'})
        
        
    }

})


router.put('/update/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_eva} = req.params
        const {id_member,id_sys,day_eva} = req.body
        const [rows] = await db.query(`update tb_eva set id_member=?,id_sys=?,day_eva=?,status_eva=? where id_eva = ?`,[id_member,id_sys,day_eva,1,id_eva])
        res.json({rows,message:"update Success"})


    } catch (error) {

        console.error("Error update",error)
        res.status(500).json({message:'Error update'})
        
        
    }

})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const [rows] = await db.query(`select * from tb_eva e ,tb_system s,tb_member m where e.id_member = m.id_member and e.id_sys = s.id_sys order by id_eva desc`)
        res.json(rows)

    } catch (error) {

        console.error("Error get",error)
        res.status(500).json({message:'Error get'})
        
        
    }

})



// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

//     try {
        
//         const [rows] = await db.query(`select * from tb_member where role= 'กรรมการประเมิน' order by id_member desc`)
//         res.json(rows)

//     } catch (error) {

//         console.error("Error get",error)
//         res.status(500).json({message:'Error get'})
        
        
//     }

// })

router.delete('/del/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_eva} = req.params
        const [rows] = await db.query(`delete from tb_eva where id_eva = '${id_eva}'`) 
        res.json(rows)
       
    } catch (error) {
        console.error("error Regis",error)
        res.status(500).json({message:'Error Regis'})
    }

})

module.exports = router