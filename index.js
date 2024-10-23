require("dotenv").config({path: './.env'})
const { app } = require("./app");
const connectToMongo = require("./db");

connectToMongo()
.then(()=> {
    app.on("error", (error) =>{
        console.log("ERR:",error)
        throw error
    })
    app.listen(process.env.PORT || 7000,() => {
        console.log(`Server is running at ${process.env.PORT} port`)
    })
})
.catch((error) => {
    console.log("MongoDb Connection Failed!!!",error)
})
