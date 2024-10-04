import express from 'express';
import userFunctions from '../services/userServices.js';
import { checkAuth } from '../utilities/middlewares.js';
const authRouter = express.Router();

authRouter.post('/register', userFunctions.registerUser);
// required email, username, password, name,phoneNumber all string

authRouter.post('/login', userFunctions.loginUser);
authRouter.get('/logout',checkAuth, userFunctions.logoutUser);

authRouter.all('*', (req, res) => {
    return res.status(400).send({
        message:"Invalid request in authRouter"
    })
    
})
export {authRouter as default}