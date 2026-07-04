require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors({
    origin: 'http://localhost:3000/',
    credentials:true
}))

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

//public api
const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

app.use((req,res)=> res.status(404).json({message:'404 : invalid ROutes'}))
app.listen(3001 , () => console.log("server running on port 3001"))