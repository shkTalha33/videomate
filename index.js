require("dotenv").config({path: './.env'})

const connectToMongo = require("./db");

connectToMongo()