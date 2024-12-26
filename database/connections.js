import mongoose from 'mongoose'
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config();
//import privateConstants from '../private_constants.js';


const connection = {};

//variables required for database connections
const mongoDatabaseURI = process.env.LOCAL_MONGODB_URI;
const databaseName = 'Dictionary';


let throwError = (message, statusCode) => {
    let err = new Error(message);
    err.status = statusCode
    throw err;
}

connection.createConnectionToMongo = async() => {
    try {
         
        const mongo=await mongoose.connect(`${mongoDatabaseURI}/${process.env.MONGO_DBNAME}`);
        if (mongo)
        {
            console.log("Connected to Database");
         }
        
    }
    catch (err) {
        
        console.error("Failed to connect MongoDB");
        process.exit(1);

    }
        

}

const mongoDBStore = connectMongoDBSession(session);
const store = new mongoDBStore({

    uri: `${mongoDatabaseURI}/${process.env.MONGO_DBNAME}`,
    collection: 'user_session'
});


connection.sessionMiddleware = () => {
    // 
    try {
    
       

        console.log("Database connection Established for session");
        return session({
            secret:process.env.SESSIONKEY,
            resave: false,
            saveUninitialized: false,
            store: store,
            cookie: {
                maxAge:60*60*1000
            }
             
        })


    }
    catch (err) {

        console.error("Failed to connect MongoDB with session");
        process.exit(1);
        
        
    }

    
}

connection.pool= mysql.createPool({
    host:process.env.MYSQL_DB_HOST,
    port:process.env.MYSQL_DB_PORT,
    user:process.env.MYSQL_DB_USER,
    password:process.env.MYSQL_DB_PASSWORD,
    database:process.env.MYSQL_DB_NAME,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0,
    multipleStatements:true
})
export {connection}