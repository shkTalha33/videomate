const mongoose = require('mongoose')
const {DB_NAME} = require('./constants')


const connectToMongo = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MOngoDB connected DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MONGODB connection ERROR=>", error)
        process.exit(1)
    }
}

module.exports = connectToMongo