

const express = require('express')
const app = express()

const userRoutes = require('./routes/users')
const cors = require('cors')

const connectDB = require('./config/DB')

require('dotenv').config()
connectDB()


app.use(cors())
app.use(express.json())

app.use('/usuario', userRoutes)
app.get('/',(req,res)=> res.send('MI API'))

app.listen(process.env.PORT, ()=>{
    console.log('servidor corriendo puerto 4000')
})
