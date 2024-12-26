import validationFunctions from '../utilities/validations.js';
import sentenceModel from '../models/sentenceModel.js';
import validator from 'validator';
import he from 'he';

const adminFunctions = {};

//insert Sentence


adminFunctions.addSentence = async function (req, res,next)
{
    

    try {
        
        //taking input chapterId as reference for sentence as unique key to identify , sequence is for ordernumber of sentence for that chapter, paragraphPosition is for paragraph starting end info
        let { chapterId, sequence, paragraphPosition, value } = req.body;

        
        chapterId=parseInt(chapterId);
        sequence = parseInt(sequence);
        paragraphPosition=paragraphPosition?parseInt(paragraphPosition):null;
        
        const userId = req.session.user.userId;
        if (!validationFunctions.checkIfAnyFieldEmpty([chapterId,sequence,value]))
        {
            return res.status(400).send({
                message:"All Fields are required"
            })
        }

        
        value = validator.escape(value);
        value = validationFunctions.organiseSentence(validationFunctions.removeExtraWhitaspace(value));



        let query = {
            chapterId,sequence
        }

//checking if the sentence is already present

        let dbSentence = await sentenceModel.checkIfSentenceAlreadyPresent({ query });
        if (dbSentence) {
             
            return res.status(400).send({
                message: "Sentence already Added",
                sentenceDetails: {
                     sentenceId: dbSentence.uuid,
                     chapterId: dbSentence.chapterId,
                     sequence: dbSentence.sequence,
                     paragraphPosition: dbSentence.paragraphPosition,
                     value: he.decode(dbSentence.value)
                }
            })
            
        }
        
// if sentence not exist 
        const sentence = new sentenceModel({ userId,chapterId, sequence, paragraphPosition, value});

        
         dbSentence = await sentence.addSentence();
         
        return res.status(200).send({
            message: "Sentence Saved Successfully",
            sentenceDetails: {
                sentenceId: dbSentence.uuid,
                chapterId: dbSentence.chapterId,
                sequence: dbSentence.sequence,
                paragraphPosition: dbSentence.paragraphPosition,
                value: he.decode(dbSentence.value)
            }
        })
       }
    catch (err)
    {
        
        next(err);
    }
   
  
    

}


//update

adminFunctions.updateSentence = async function (req,res,next) {
    
    
    try {
        

        
        let { sentenceId , chapterId,sequence, paragraphPosition, value } = req.body;
        
        
        chapterId = parseInt(chapterId);
        sequence = parseInt(sequence);
        paragraphPosition = parseInt(paragraphPosition);
            
            const userId = req.session.user.userId;
           
        if (!validationFunctions.validateUUID([sentenceId])) {
                return  res.status(400).send({
                    message:"Invalid sentence Id"
                })
        
            }
          //  bookName = validator.escape(bookName);//if we pass number datadype to escape it coverts it to string 123 to '123'

         //checking if sentence is available or not
        
        let dbSentence = await sentenceModel.findSentenceById({ sentenceId });
       
        if (!dbSentence)
        {
            return res.status(400).send({
               message:"sentence does't exist"
           })
        }


        //updating sentence

        const objectOfSentenceModel = new sentenceModel({ userId, sentenceId, chapterId, sequence, paragraphPosition, value }); 
        
         dbSentence = await objectOfSentenceModel.updateSentence();
           return res.status(200).send({
             message: "Sentence Updated Successfully",
             sentenceDetails: {
                 sentenceId: dbSentence.uuid,
                 chapterId: dbSentence.chapterId,
                 sequence: dbSentence.sequence,
                 paragraphPosition: dbSentence.paragraphPosition,
                 value: he.decode(dbSentence.value)
             }
 
               })



    }
    catch (err)
    {
        console.log("Error in update sen",err);
        next(err);
    }

}



//delete sentence


adminFunctions.deleteSentence = async function (req, res,next) {
    

        try {

            const { sentenceId } = req.body;//taking from request body

            const userId = req.session.user.userId;
            //validating is it mongodbid or not
            if (!validationFunctions.validateUUID([sentenceId])) {
                return res.status(400).send({
                    message: "Invalid sentence id",
                    
                })
        
        
            }


           // let dbSentence = await sentenceModel.findSentenceById(sentenceId);
            


            const sentence = new sentenceModel({ sentenceId ,userId});

            const dbSentence = await sentence.deleteSentence();
            if (!dbSentence)
            {
                return res.status(403).send({
                    message:"No Sentence Found for deletion ",
                    
                  })
                }
            return res.status(200).send({
              message:"Sentence deleted successfully",
              
            })




            
        }
        catch (err) {
            next(err)
        }
    
       
    
    //if sentence exist or not
    
       
    
        //deleting sentence
        
        
}

adminFunctions.readSentences = async function (req,res,next) {
    
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
        console.log()
        let dbSentences = await sentenceModel.findSentences({ query, skip, limit });
       // console.log(dbSentences);
        let arrayOfSentences = dbSentences.map(obj => {
            return {
                sentenceId: obj.uuid,
                sentence:obj.value
            }
        })
        return res.status(200).send({
            data:arrayOfSentences
        })
          
        


    }
    catch (err)
    {
        next(err);
    }

}
adminFunctions.importChapter= async function (req, res, next) {

    try {
         
        const {text,chapterId}=req.body
        const userId = req.session.user.userId;
          let availableSequence= await sentenceModel.findHeighestSequence(chapterId);
           
          const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
          let sentenceObj;
          //const sentence = new sentenceModel({ userId,chapterId, sequence, paragraphPosition, value});
          for (const [index, sentence] of sentences.entries())  {
            // Trim any extra spaces from the sentence
            ++availableSequence;
            let trimmedSentence = sentence.trim();
             
            sentenceObj= new sentenceModel({ userId,chapterId, sequence:availableSequence, value:trimmedSentence});
            let response =await sentenceObj.addSentence();
            
            
        };


         // const chapters=await sentenceModel.importChapter(chapterId,text);
   

        
        //console.log(bookWithHindi);
        return res.status(200).send({
            message: "books imported successfully",
            
        })
    }
    catch (err)
    {
        next(err);
    }

}


export default adminFunctions;