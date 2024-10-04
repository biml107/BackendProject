import express from 'express';
import userFunctions from '../services/userServices.js';
import { checkAuth } from '../utilities/middlewares.js';
const userRouter = express.Router();



userRouter.post('/addhindi',checkAuth, userFunctions.addHindi);
userRouter.put('/updatehindi',checkAuth, userFunctions.updateHindi);
userRouter.delete('/deletehindi',checkAuth, userFunctions.deleteHindi);


userRouter.post('/addexplanation',checkAuth, userFunctions.addExplanation);
userRouter.put('/updateexplanation', checkAuth,userFunctions.updateExplanation);
userRouter.delete('/deleteexplanation', checkAuth,userFunctions.deleteExplanation);

 
userRouter.put('/updateprofile', checkAuth, userFunctions.updateUserDetails);

userRouter.get('/getprofile', checkAuth, userFunctions.getProfile);


userRouter.get('/getbook', userFunctions.getBook);

userRouter.get('/gethindibook', userFunctions.getEnglishBookWithHindi);
userRouter.all('*', (req, res) => {
    return res.status(400).send({
        message:"Invalid request in userRouter"
    })
    
})
export {userRouter as default}




