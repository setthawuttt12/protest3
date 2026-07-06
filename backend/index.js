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

const dash = require('./dash')
app.use('/api/profile',dash)

const member = require('./routes/Staff/member')
app.use('/api/Staff/member',member)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const topic = require('./routes/Staff/topic')
app.use('/api/Staff/topic',topic)

const indicate = require('./routes/Staff/indicate')
app.use('/api/Staff/indicate',indicate)

const round = require('./routes/Staff/round')
app.use('/api/Staff/round',round)

const eva = require('./routes/Staff/eva')
app.use('/api/Staff/eva',eva)

const commit = require('./routes/Staff/commit')
app.use('/api/Staff/commit',commit)

const Stscore_member = require('./routes/Staff/score_member')
app.use('/api/Staff/score_member',Stscore_member)

const Stscore_commit = require('./routes/Staff/score_commit')
app.use('/api/Staff/score_commit',Stscore_commit)

// eva api]
const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)


const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)


//commit api
const score_member2 = require('./routes/Commit/score_member')
app.use('/api/Commit/score_member',score_member2)

const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

const save_score = require('./routes/Commit/save_score')
app.use('/api/Commit/save_score',save_score)


app.use((req,res)=> res.status(404).json({message:'Route not find'}))
app.listen(PORT,() =>{

    console.log(`SERVER RUNNIG ON ${PORT}`);
    

})
