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


userRouter.get('/getenglishchaptersentences', userFunctions.getEnglishBook);

userRouter.get('/gethindibook', userFunctions.getEnglishBookWithHindi);
userRouter.get("/getStandards",userFunctions.getStandards);
userRouter.post("/getSubjects",userFunctions.getSubjects);
userRouter.post("/getBooks",userFunctions.getBooks);
userRouter.post("/getChapters",userFunctions.getChapters);
userRouter.get("/getDropdownOptions",userFunctions.getDropdownOptions);
userRouter.get('/gethinditranslates',userFunctions.getHindiTranslatesOfSentence);

userRouter.all('*', (req, res) => {
    return res.status(400).send({
        message:"Invalid request in userRouter"
    })
    
})
export {userRouter as default}




