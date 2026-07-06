const express = require('express')
const db = require('./db')
const path = require('path')
const router = express.Router()
const {verifyToken,requireRole} = require('./middleware/authmiddleware')

router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async(req,res)=>{

    try {

        const [[staff]] = await db.query(`select count(*)as total from tb_member where role='ฝ่ายบุคลากร'`)
        const [[eva]] = await db.query(`select count(*)as total from tb_member where role='ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as total from tb_member where role='กรรมการประเมิน'`)
        const [[EvaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[EvaY]] = await db.query(`select count(*)as total from tb_eva where status_eva = 'y'`)
        const [[EvaN]] = await db.query(`select count(*)as total from tb_eva where status_eva = 'n'`)
        res.json({
            box1:[
                {title:'ฝ่ายบุคลากร',value:staff.total || 0},
                {title:'ผู้รับการประเมินผล',value:eva.total || 0},
                {title:'กรรมการประเมิน',value:commit.total || 0}
            ],
            box2:[
                {title:'จำนวนแบบประเมิน',value:EvaCount.total || 0},
                {title:'แบบประเมินที่สำเร็จ',value:EvaCount.total > 0 ? `${(EvaY.total * 100 / EvaCount.total).toFixed(2)}%`:'00.00%'},
                {title:'แบบประเมินไม่ที่สำเร็จ',value:EvaCount.total > 0 ? `${(EvaN.total * 100 / EvaCount.total).toFixed(2)}%`:'00.00%'}
            ]
        })

    }catch(error) {
        
    }


})

module.exports = router