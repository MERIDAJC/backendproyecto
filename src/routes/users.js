

const express= require('express');
const app = express.Router()
const Usuario = require('../models/Usuario')
const bcryptjs = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')

app.get('/obtener',auth, async (req,res)=>{
  
    try {
        const usuarios = await Usuario.find({})
        res.json([usuarios])
        
    } catch (error) {
        res.status(500).json({mensaje:'error en datos'})
    }
})


app.post('/crear', async(req,res)=>{

    const{username,email,password } = req.body

    try {
        const salt= await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)
        const respuestaDB = await Usuario.create({
            username,
            email,
            password: hashedPassword,
        })

      const payload = {
        user: {
            id: respuestaDB._id,
        },
      }  

      jwt.sing(
        payload,
        process.env.SECRET,
        {
            expiresIn: 360000,
        },
        (error, token)=>{
            if (error) throw error
            res.json({token}) 
        },
      )


    } catch (error) {
        res.status(400).json({mensaje: error,})        
    }

})

//inicio seccion

app.post('/login', async(req,res) => {

    const { email,password } = req.body

    try {
        let foudUser = await Usuario.findOne({email: email})
        if(!foudUser) {
            return res.status(400).json({mensaje: 'no existe usuario'})
        }

        const passwordCorrecto = await bcryptjs.compare(password, foudUser.password)
        if(!passwordCorrecto){
            return  await res.status(400).json({mensaje: 'no hay pas'})
        } 


        const payload = {
            user: {
                id: foudUser.id,
            },
          }  

       if(email&&passwordCorrecto){
        jwt.sign( 
                 payload, 
                 process.env.SECRET,
                 {expiresIn: 360000},
                 (error, token)=>{
                    if(error) throw error
                    res.json({token})
          })   
        } else {
            res.json({mensaje:'hubo error', error})
        }  
        
    } catch (error) {
        res.json({mensaje: 'hay error', error})
    }
})  


app.get('/verificar', auth, async( req,res )=>{
    try {
        const usuario = await Usuario.findById(req.user.id).select('-password')
        res.json({usuario})
    } catch (error) {
        res.status(500).json({mensaje: 'hay error', error})
    }

})

app.put('/actualizar', auth, async(req,rep)=>{
    
    const { nombre ,email} = req.body
    
    try {
        const actualizacionUsuario = await Usuario.findOneAndUpdate (req.user.id, { nombre, email}, { new:true}) 
        res.json(actualizacionUsuario)   
    } catch (error) {
        res.status(500).json({mensaje: 'hay error en creacion'})
    }

})

module.exports = app