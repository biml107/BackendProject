import express from 'express';
import adminRouter from './adminRouter.js';
import userRouter from './userRouter.js';
import authRouter from './authRouter.js';
const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/admin', adminRouter);
mainRouter.use('/user', userRouter);


mainRouter.all('*', (req, res) => {

    res.status(400).send({
        message:"Invalid Request in mainRouter"
    })
})

export {mainRouter as default}
