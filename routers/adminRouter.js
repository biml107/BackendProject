import express from 'express';
import adminFunctions from '../services/adminServices.js';
import { checkAuth } from '../utilities/middlewares.js';
const adminRouter = express.Router();


adminRouter.post('/addsentence',checkAuth, adminFunctions.addSentence);
adminRouter.put('/updatesentence', checkAuth,adminFunctions.updateSentence);
adminRouter.delete('/deletesentence',checkAuth, adminFunctions.deleteSentence);

adminRouter.get('/readsentences', checkAuth, adminFunctions.readSentences);



adminRouter.all('*', (req, res) => {
    return res.status(400).send({
        message:"Invalid request"
    })
    
})
export {adminRouter as default}