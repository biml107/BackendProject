import validationFunctions from '../utilities/validations.js';

import sentenceModel from '../models/sentenceModel.js';
import hindiSentenceModel from '../models/hindiModel.js';
import explanationModel from '../models/explanationModel.js';
import userModel from '../models/userModel.js';

import validator from 'validator';
import he from 'he';


const userFunctions = {};

const throwError = (errMessage, errStatus) => {
    let err = new Error(errMessage);
    err.status = errStatus;
    throw err;
}

userFunctions.addHindi = async function (req, res, next) {
    
    try {
        
        let { englishSentenceId, hindi, hindiExplain } = req.body;
        
       
        const userId = req.session.user.userId;

        const creationDateTime = new Date();




        if (!validationFunctions.checkIfAnyFieldEmpty([englishSentenceId, hindi])) 
        {
            return  res.status(400).send({
                message:"Invalid Credentials"
            })
            
        }
        
        if (!validationFunctions.validateUUID([englishSentenceId])) { 
            return  res.status(400).send({
                 message:"Invalid English Sentence Id"
             })
     
        }


        

        


        hindi = validationFunctions.removeExtraWhitaspace(validator.escape(hindi));
        hindiExplain = hindiExplain?validationFunctions.removeExtraWhitaspace(validator.escape(hindiExplain)):hindiExplain;

        //checking if the english sentence is present or not

        const dbEnglishSentence = sentenceModel.findSentenceById({ sentenceId: englishSentenceId });
        if (!dbEnglishSentence)
        {
            
            throwError("English Sentence not availabe", 400);
            // return res.status(400).send({
            //     message:"English Sentence not availabe"
            // })
        }
        

        //checking number of hindi sentence added by the specefic user
        const countSentence = await hindiSentenceModel.countAddedHindi({ englishSentenceId, userId });
      //  console.log(countSentence);
        if (countSentence >=3)
        {
            return res.status(409).send({
                message:"You can't add more than three hindi sentence"
            })
            }

             
        const hindiModelObject = new hindiSentenceModel({ englishSentenceId, hindi, hindiExplain,creationDateTime, userId });
          
        
        // saving  hindi sentence
        const dbHindiSentence = await hindiModelObject.addHindiTanslate();

        return res.status(200).send({
            message: "Hindi Sentence Saved Successfully ",
            hindiDetails: {
                hindiSentenceId: dbHindiSentence.uuid,
                hindi: he.decode(dbHindiSentence.hindi),
                hindiExplain: dbHindiSentence.hindiExplain?he.decode(dbHindiSentence.hindiExplain):null,//here hindiexplain is again processed in decode so if it not present in doc then decode will throw error
                userId:dbHindiSentence.userId
            }

        })
        

        
    }

    catch (err) {
        next(err)
    }

}


userFunctions.updateHindi = async function (req, res, next) {
    
    try {

        let { hindiSentenceId, hindi, hindiExplain } = req.body;
        const userId = req.session.user.userId;
        if (!validationFunctions.checkIfAnyFieldEmpty([hindiSentenceId]))
        {
            return  res.status(400).send({
                message:"Bad Request"
            })


        }

        if (!validationFunctions.validateUUID([hindiSentenceId])) {//here in array during updation i have to check userId also
            return  res.status(400).send({
                 message:"Invalid Hindi sentence Id"
             })
     
        }
        
        hindi =hindi? validationFunctions.removeExtraWhitaspace(validator.escape(hindi)):hindi;//check if hindi is null then escape fun will throw error
        hindiExplain = hindiExplain?validationFunctions.removeExtraWhitaspace(validator.escape(hindiExplain)):hindiExplain;
        
        if (!hindi && !hindiExplain)
        {
            
            return  res.status(400).send({
                message:"Bad Credentials"
            })
        }
       

        const hindiModelObject = new hindiSentenceModel({ hindiSentenceId, hindi, hindiExplain,userId });

        const dbHindiSentence = await hindiModelObject.updateHindiTranslate();

        if (!dbHindiSentence)
        {
            
            return res.status(403).send({
                message:"No Document found to update or You are not Authorised to update"
            })
        }
        
        return res.status(200).send({
            message: "Hindi Sentence Updated Successfully",
            data: {
                hindiSentenceId: dbHindiSentence.uuid,
                hindi:dbHindiSentence.hindi? he.decode(dbHindiSentence.hindi):null,
                hindiExplain:dbHindiSentence.hindiExplain?he.decode(dbHindiSentence.hindiExplain):null
                
            }

        })
        

    

        

        
    }
    catch (err) {
        next(err);

    }
}

userFunctions.deleteHindi = async function (req, res, next) {
    
    try {
        const { hindiSentenceId } = req.body;
        const userId = req.session.user.userId;
        if (!validationFunctions.validateUUID([hindiSentenceId])) {
            return  res.status(400).send({
                 message:"Invalid mongo Id"
             })
     
        }

        const hindiModelObject = new hindiSentenceModel({ hindiSentenceId ,userId});

        const dbHindiSentence = await hindiModelObject.deleteHindiTranslate();

        if (!dbHindiSentence)
        {
            
            return res.status(403).send({
                message:"No Document found to delete or not authorised"
            })
        }
        
        return res.status(200).send({
            message:"Sentence Deleted Successfully"
        })





    }
    catch (err)
    {
        next(err)
    }
}


////functions for Explanation collection

userFunctions.addExplanation = async function (req, res, next) {
    

    try {
    
        let { englishSentenceId, simpleEnglish, simpleEnglishHindi, englishExplain, explainWithGrammer} = req.body;
        const userId = req.session.user.userId;
        const creationDateTime = new Date();

        if (!validationFunctions.checkIfAnyFieldEmpty([englishSentenceId, simpleEnglish, simpleEnglishHindi, englishExplain, explainWithGrammer]))
        {
            return  res.status(400).send({
                message:"Invalid Credentials"
            })

        }
        
         
        if (!validationFunctions.validateUUID([englishSentenceId])) { 
            return  res.status(400).send({
                 message:"Invalid Sentence  Id"
             })
     
        }
      
        simpleEnglish = validationFunctions.removeExtraWhitaspace(validator.escape(simpleEnglish));
        simpleEnglishHindi = validationFunctions.removeExtraWhitaspace(validator.escape(simpleEnglishHindi));
        englishExplain = validationFunctions.removeExtraWhitaspace(validator.escape(englishExplain));
        explainWithGrammer = validationFunctions.removeExtraWhitaspace(validator.escape(explainWithGrammer));
         



        //checking if english sentence present or not

        const dbEnglishSentence = await sentenceModel.findSentenceById({ sentenceId: englishSentenceId });
        if (!dbEnglishSentence)
        {
            
            return res.status(400).send({
                message:"English Sentence not availabe"
            })
        }


        // count the number of explanations added by users for that english sentence
        
        const countExplanation = await explanationModel.countExplanationByUserIdAndEnglishSentenceId({ englishSentenceId, userId });
        if (countExplanation >= 3)
        {
            return res.status(409).send({
                message:"You can add only three explanation for a sentence"
            })
            }

        //saving daata
        
        //creating object of explanationModel
        const explanationModelObject = new explanationModel({ englishSentenceId, simpleEnglish, simpleEnglishHindi, englishExplain, explainWithGrammer, userId, creationDateTime });

        

        const dbExplanation = await explanationModelObject.addExplanation();

        return res.status(200).send({
            message: "Explanation Saved Successfully ",
            explanationDetails: {
                explanationId: dbExplanation.uuid,
                simpleEnglish: he.decode(dbExplanation.simpleEnglish),
                simpleEnglishHindi: he.decode(dbExplanation.simpleEnglishHindi),
                englishExplain: he.decode(dbExplanation.englishExplain),
                explainWithGrammer:he.decode(dbExplanation.explainWithGrammer),
                 
            }

        })

    }
    catch (err)
    {
        next(err)
    }

}




userFunctions.updateExplanation = async function (req, res, next) {
    
    try {
        
        let { explanationId, simpleEnglish, simpleEnglishHindi, englishExplain, explainWithGrammer } = req.body;

        const userId = req.session.user.userId;

        if (!validationFunctions.validateUUID([explanationId]))
        {
            throwError("Invalid Explanation Id", 400);
        }
        

        simpleEnglish = simpleEnglish ? validationFunctions.removeExtraWhitaspace(validator.escape(simpleEnglish)) : simpleEnglish;
        simpleEnglishHindi = simpleEnglishHindi ? validationFunctions.removeExtraWhitaspace(validator.escape(simpleEnglishHindi)) : simpleEnglishHindi;
        englishExplain = englishExplain ? validationFunctions.removeExtraWhitaspace(validator.escape(englishExplain)) : englishExplain;
        explainWithGrammer = explainWithGrammer ? validationFunctions.removeExtraWhitaspace(validator.escape(explainWithGrammer)) : explainWithGrammer;

       
        const explanationModelObject = new explanationModel({ explanationId, simpleEnglish, simpleEnglishHindi, englishExplain, explainWithGrammer,userId });

        const dbExplanation = await explanationModelObject.updateExplanation();

        if (!dbExplanation)
        {
            throwError("No such Document found to update or unauthorised to update ", 403);
        }
        
        return res.status(200).send({
            message: "Explanation Updated Successfully",
            explanationDetails: {
                simpleEnglish: he.decode(dbExplanation.simpleEnglish),
                simpleEnglishHindi: he.decode(dbExplanation.simpleEnglishHindi),
                englishExplain: he.decode(dbExplanation.englishExplain),
                explainWithGrammer:he.decode(dbExplanation.explainWithGrammer),
                
            }

        })

    }
    catch (err)
    {
        next(err);
    }
}

userFunctions.deleteExplanation = async function (req, res, next) {
    
    try {
        
        const { explanationId } = req.body;
        const userId = req.session.user.userId;

        if (!validationFunctions.validateUUID([explanationId])) {
            throwError("Invalid explanationId ", 400);
           
             
     
        }


        const explanationModelObject = new explanationModel({ explanationId,userId });

        const dbExplanation = await explanationModelObject.deleteExplanation();
         
        if (!dbExplanation)
        {
            throwError("No Document found to delete", 403);
            
        }
        
        return res.status(200).send({
            message:"Explanation Deleted Successfully"
        })


    }
    catch (err) {
        next(err);
    }
}



userFunctions.registerUser = async function (req, res, next) {
    
    try {
        
        let { email, username, password, name, phoneNumber, profilePic, addressLine,village,postOffice,policeStation,dist,state,country,pin } = req.body;
        
        
        if (!validationFunctions.checkIfAnyFieldEmpty([email, username, password, name,phoneNumber])) {
            throwError("Insufficient Credentials for registration ", 404);
        }
        
        await validationFunctions.cleanUpUserDetails({ email, username, password, name, phoneNumber, profilePic, addressLine,village,postOffice,policeStation,dist,state,country,pin });
         
        email=validationFunctions.removeExtraWhitaspace(email.toLowerCase()) ;
        username = validationFunctions.removeExtraWhitaspace(username.toLowerCase());
        name =validationFunctions.removeExtraWhitaspace(name.toUpperCase());
        addressLine = addressLine ? validationFunctions.removeExtraWhitaspace(addressLine.toUpperCase()) : addressLine;
        village = village ? validationFunctions.removeExtraWhitaspace(village.toUpperCase()) : village;
        postOffice = postOffice ? validationFunctions.removeExtraWhitaspace(postOffice.toUpperCase()) : postOffice;
        policeStation = policeStation ? validationFunctions.removeExtraWhitaspace(policeStation.toUpperCase()) : policeStation;
        dist = dist ? validationFunctions.removeExtraWhitaspace(dist.toUpperCase()) : dist;
        state = state ? validationFunctions.removeExtraWhitaspace(state.toUpperCase()) : state;
        country = country ? validationFunctions.removeExtraWhitaspace(country.toUpperCase()) : country;
        pin = pin ? validationFunctions.removeExtraWhitaspace(pin) : pin;
        //check if username already exist

        const dbUserCheck = await userModel.verifyUsernameAndEmailExists({ username, email });

        if (dbUserCheck && dbUserCheck.email === email) {
            throwError("User with this email already exists", 409);
                 
            }
        if (dbUserCheck && dbUserCheck.username === username) {
            throwError("User with this username already exists", 409);
                 
        }
        
        //saving data to database
        const user = new userModel({ email, username, password, name, phoneNumber, profilePic,addressLine,village,postOffice,policeStation,dist,state,country,pin });

         
        const dbUserSave = await user.registerUser();


        return res.status(200).send({
            message: "User Registered Successfully",
            userDetails: {
                username: dbUserSave.username,
                email: dbUserSave.email,
                name: dbUserSave.name,
                phoneNumber: dbUserSave.phoneNumber,
                address: {
                    addressLine: dbUserSave.address.addressLine ,
                    village: dbUserSave.address.village,
                    postOffice: dbUserSave.address.postOffice,
                    policeStation: dbUserSave.address.policeStation,
                    dist: dbUserSave.address.dist,
                    state: dbUserSave.address.state,
                    country: dbUserSave.address.country,
                    pin: dbUserSave.address.pin,
                }
            }
        })
         




    }
    catch (err) {
        next(err);
    }
    
    
    

}

userFunctions.updateUserDetails = async function (req, res, next) {
    try {
        
        let { email, username, password, name, phoneNumber, profilePic,
            addressLine, village, postOffice, policeStation, dist, state, country, pin } = req.body;
 
        const userId = req.session.user.userId;
        
        //input data validations
        await validationFunctions.cleanUpUserDetails({
            email, username, password, name, phoneNumber, profilePic,
            addressLine, village, postOffice, policeStation, dist, state, country, pin
        });



        email=email?validationFunctions.removeExtraWhitaspace(email.toLowerCase()):email ;
        username =username? validationFunctions.removeExtraWhitaspace(username.toLowerCase()):username;
        name =name?validationFunctions.removeExtraWhitaspace(name.toUpperCase()):name;
        addressLine = addressLine ? validationFunctions.removeExtraWhitaspace(addressLine.toUpperCase()) : addressLine;
        village = village ? validationFunctions.removeExtraWhitaspace(village.toUpperCase()) : village;
        postOffice = postOffice ? validationFunctions.removeExtraWhitaspace(postOffice.toUpperCase()) : postOffice;
        policeStation = policeStation ? validationFunctions.removeExtraWhitaspace(policeStation.toUpperCase()) : policeStation;
        dist = dist ? validationFunctions.removeExtraWhitaspace(dist.toUpperCase()) : dist;
        state = state ? validationFunctions.removeExtraWhitaspace(state.toUpperCase()) : state;
        country = country ? validationFunctions.removeExtraWhitaspace(country.toUpperCase()) : country;
        

        //check user present or not
        if (username || email)
        {
            

            const dbUserCheck = await userModel.verifyUsernameAndEmailExists({ username, email });

            if (dbUserCheck && dbUserCheck.email === email) {
                throwError("User with this email already exists", 409);
                     
                }
            if (dbUserCheck && dbUserCheck.username === username) {
                throwError("User with this username already exists", 409);
                     
            }
        }
        
         
        const userObject = new userModel({ userId,email, username, password, name, phoneNumber, profilePic, addressLine,village,postOffice,policeStation,dist,state,country,pin });

        const dbUserUpdate = await userObject.updateUser();
         
        return res.status(200).send({
            message: "Details Updated Successfully",
           userDetails: {
                username: dbUserUpdate.username,
                email: dbUserUpdate.email,
                name: dbUserUpdate.name,
                phoneNumber: dbUserUpdate.phoneNumber,
                address: {
                    addressLine: dbUserUpdate.address.addressLine ,
                    village: dbUserUpdate.address.village,
                    postOffice: dbUserUpdate.address.postOffice,
                    policeStation: dbUserUpdate.address.policeStation,
                    dist: dbUserUpdate.address.dist,
                    state: dbUserUpdate.address.state,
                    country: dbUserUpdate.address.country,
                    pin: dbUserUpdate.address.pin,
                }
            }
        })
       



    }
    catch (err) {
        next(err);
    }
}

userFunctions.loginUser = async function (req, res, next) {
    
  
    try {
        const { loginId, password } = req.body;
  
        if(!loginId||!password){
         
            return res.status(409).send({
                message:"invalid credentials "
            })
        }
        
        const dbUser = await userModel.findUserWithLoginId(loginId);
         
        if (!dbUser)
        {
            return res.status(409).send({
                message: "No User Found with this loginId"
            })
        }
        
        const isMatch=password===dbUser.password?true:false;
        if(!isMatch)
        {
            return res.status(409).send({
                message:"Invalid Password"
            })
        }
        //console.log(dbUser.uuid);
        req.session.isAuth=true;
        req.session.user = {
            userId: dbUser.uuid
             
        }
        return res.status(200).send({
            message:"login successfull"
         })


    }
    catch (err) {
        next(err);
    }
}

userFunctions.logoutUser = async function (req, res, next) {
    try {
        req.session.destroy((err)=>{
            if (err)
            {
                return res.status(401).send({
                    message: "Logout unsuccessfull",
                    error:err
                })
            }
    
            return res.status(200).send({
                message:"Logged out successfully"
           });
        })
    }
    catch (err)
    {
        next(err);
    }
}
userFunctions.getProfile = async function (req, res, next) {
    try {
        
        const userId = req.session.user.userId;

        const dbUser = await userModel.getProfile({ userId });
        
        return res.status(200).send({
            message: "Profile fetched successfully",
            userDetails: {
                name: dbUser.name,
                username: dbUser.username,
                email: dbUser.email,
                phoneNumber: dbUser.phoneNumber?dbUser.phoneNumber:null,
                address:dbUser.address?dbUser.address:null
            }
        })

    } catch (err)
    {
        next();
    }
}

userFunctions.getBook = async function (req,res,next) {
    
    try {
        
        

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const standard = parseInt(req.query.class);
        const chapter = parseInt(req.query.chapter);
        const bookName = req.query.bookName;

        
        if (!validationFunctions.checkIfAnyFieldEmpty([standard, chapter, bookName]))
        {
            return res.status(400).send({
                message:"Invalid Request"
            })
        }
        
        let query = {
            standard,chapter,bookName
        }

        const skip = (page - 1) * limit;
        let dbSentences = await sentenceModel.findSentences({ query, skip, limit });
         
       
        
        return res.status(200).send({

            message:"Book fetched Successfully",
            data:dbSentences
        })
          
        


    }
    catch (err)
    {
        next(err);
    }

}
userFunctions.getHindiTranslates = async function (req, res, next) {
    
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const standard = parseInt(req.query.class);
        const chapter = parseInt(req.query.chapter);
        const bookName = req.query.bookName;

        
        if (!validationFunctions.checkIfAnyFieldEmpty([standard, chapter, bookName]))
        {
            return res.status(400).send({
                message:"Invalid Request"
            })
        }
        
        let query = {
            standard,chapter,bookName
        }

        const skip = (page - 1) * limit;
         
        const dbHindiSentences = await hindiSentenceModel.findHindiBook({ query })

        return res.status(200).send({
            message:"book fetched ",
        })


    }
    catch (err)
    {
        next(err);
    }
}

userFunctions.getEnglishBookWithHindi = async function (req, res, next) {
    
    try {
       

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const standard = parseInt(req.query.class);
        const chapter = parseInt(req.query.chapter);
        const bookName = req.query.bookName;


        
        if (!validationFunctions.checkIfAnyFieldEmpty([standard, chapter, bookName]))
        {
            return res.status(400).send({
                message:"Invalid Request"
            })
        }
        
        let query = {
            standard,chapter,bookName
        }

        const skip = (page - 1) * limit;

        const bookWithHindi = await sentenceModel.getEnglishBookWithHindi({ query, skip, limit });
        
        //console.log(bookWithHindi);
        return res.status(200).send({
            message: "book fetched successsfully",
            data:bookWithHindi
        })
    }
    catch (err)
    {
        next(err);
    }
    
}
export default userFunctions;