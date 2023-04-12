const jwt = require('jsonwebtoken')

module.exports = (req,res,netx)=>{
    const token = req.header('x-auth-token')
    
    if(!token){
        return res.status(401).json({mensaje:'no hay permiso',})
    }
    try {
        const openToken = jwt.verify(token, process.env.SECRET)
        req.user = openToken-user


        netx()
        
    } catch (error) {
        res.json({mensaje:'hay un error', error,})
    }


}