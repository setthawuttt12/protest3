require('dotenv').config({path:'.env'})

const express = require('express')
const cors = require('cors')
const fileup = require('express-fileupload')
const PORT = process.env.PORT
const path = require('path')
const app = express()

app.use(cors({

    origin:'http://localhost:3000',
    credentials: true

}))

app.use(fileup())
app.use(express.json())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use(express.urlencoded({extended:true}))

const auth = require('./auth')
app.use('/api/auth',auth)

app.use((req,res)=> res.status(404).json({message:'Route not find'}))
app.listen(PORT,() =>{

    console.log(`SERVER RUNNIG ON ${PORT}`);
    

})
