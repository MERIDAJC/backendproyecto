const mongoose = require('mongoose')
require('dotenv').config()


const connectDB = async () => {
    try {
        await mongoose.connect( 'mongodb+srv://MERIDA1:AImjOSiobiTIu5PB@atlascluster.9tzxbas.mongodb.net/test' ,{
             useNewUrlParser: true,
             useUnifiedTopology: true,
        })
        console.log('base conectada')
    } catch (error) {
        console.log(error)
        process.exit(1)            
    }
}

module.exports = connectDB