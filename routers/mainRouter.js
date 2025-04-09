import express from 'express';
import adminRouter from './adminRouter.js';
import userRouter from './userRouter.js';
import authRouter from './authRouter.js';
const mainRouter = express.Router();

mainRouter.use('/api/auth', authRouter);
mainRouter.use('/api/admin', adminRouter);
mainRouter.use('/api/user', userRouter);


mainRouter.all('*', (req, res) => {

    res.status(400).send({
        message:"Invalid Request in mainRouter"
    })
})

export {mainRouter as default}
