const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.post('/save/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_eva} = req.params
        await db.query(`delete from tb_commit where id_eva = ?`,[id_eva])
        const m = req.body
        const v = m.map((c)=>[id_eva,c.id_member,'n',c.role])

        const [rows] = await db.query(`insert into tb_commit(id_eva,id_member,status_commit,level_commit) values ?`,[v])
        res.json({rows,message:"REgis Success"})

    } catch (error) {

        console.error("Error REgis",error)
        res.status(500).json({message:'Error Regis'})
        
        
    }

})


// router.put('/update/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

//     try {
        
//         const {id_eva} = req.params
//         const {id_member,id_sys,day_eva} = req.body
//         const [rows] = await db.query(`update tb_indicate set id_member=?,id_sys=?,day_eva=?,status_eva=? where id_eva = ?`,[id_member,id_sys,day_eva,1,id_eva])
//         res.json({rows,message:"update Success"})


//     } catch (error) {

//         console.error("Error update",error)
//         res.status(500).json({message:'Error update'})
        
        
//     }

// })

router.get('/show/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_eva} = req.params.id_eva
        const [before] = await db.query(`select id_member,concat(first_name,'',last_name)as fullname_commit from tb_member where role= 'กรรมการประเมิน' order by id_member desc`)
        const [after] = await db.query(`select id_commit,tb_member.id_member,first_name,last_name,level_commit as role from tb_member,tb_eva,tb_commit where tb_commit.id_eva = ? and tb_commit.id_member = tb_member.id_member`,[id_eva])
        
        res.json({before,after})
    } catch (error) {

        console.error("Error get",error)
        res.status(500).json({message:'Error get'})
        
        
    }

})

router.get('/header/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_eva,tb_member,tb_system where tb_eva.id_eva='${id_eva}' and tb_member.id_member=tb_eva.id_member and tb_eva.id_sys=tb_system.id_sys`)
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

router.delete('/del/:id_commit',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {
        
        const {id_commit} = req.params
        const [rows] = await db.query(`delete from tb_commit where id_commit = '${id_commit}'`) 
        res.json(rows)
       
    } catch (error) {
        console.error("error Regis",error)
        res.status(500).json({message:'Error Regis'})
    }

})

module.exports = router