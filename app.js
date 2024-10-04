//packages import

import express from 'express';


import { rateLimit } from 'express-rate-limit'
import cors from 'cors';
import helmet from 'helmet';

//importing local modules
import { connection } from './database/connections.js'; 
import { requestLogger } from './utilities/requestLogger.js';
import { errorLogger } from './utilities/errorLogger.js';

import mainRouter from './routers/mainRouter.js';


const app = express();

//Establishing Database connection
connection.createConnectionToMongo();
const limiter=rateLimit({
    windowsMs:15*60*1000,
    max:100,
    message:'Too many request for this IP, Please try again later'
});
app.use(limiter);
app.use(helmet());
app.use(express.json());//this middle ware convert JSON data to javascript object and attached in req.body .actually in req.body we send json so in api use it as js object express.json convert it
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(connection.sessionMiddleware());
app.use(requestLogger);
app.use('/',mainRouter)
app.use(errorLogger);

const PORT = process.env.PORT||3001;
app.listen(PORT, () => {
    console.log('Listening on port '+ PORT);
});




