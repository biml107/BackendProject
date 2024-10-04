import validationFunctions from '../utilities/validations.js';
import sentenceModel from '../models/sentenceModel.js';
import validator from 'validator';
import he from 'he';

const adminFunctions = {};

//insert Sentence


adminFunctions.addSentence = async function (req, res,next)
{
    

    try {
        
        let { standard, chapter, bookName, sequence, position, value } = req.body;

        standard = parseInt(standard);
        chapter = parseInt(chapter);
        sequence = parseInt(sequence);
        position = parseInt(position);

        const userId = req.session.user.userId;
        if (!validationFunctions.checkIfAnyFieldEmpty([standard, chapter, bookName, sequence, position, value]))
        {
            return res.status(400).send({
                message:"All Fields are required"
            })
        }

       
       


        bookName = validator.escape(bookName);
        bookName = validationFunctions.removeExtraWhitaspace(bookName);
        
        value = validator.escape(value);
        value = validationFunctions.organiseSentence(validationFunctions.removeExtraWhitaspace(value));



        let query = {
            standard,
            chapter,bookName,sequence,position,
        }

//checking if the sentence is already present

        let dbSentence = await sentenceModel.checkIfSentenceAlreadyPresent({ query });
        if (dbSentence) {
             
            return res.status(400).send({
                message: "Sentence already Added",
                sentenceDetails: {
                     sentenceId: dbSentence.uuid,
                     standard: dbSentence.standard,
                     bookName: he.decode(dbSentence.bookName),
                     chapter: dbSentence.chapter,
                     sequence: dbSentence.sequence,
                     position: dbSentence.position,
                     value: he.decode(dbSentence.value)
                }
            })
            
        }
        

        const sentence = new sentenceModel({ userId,standard, chapter, bookName, sequence, position, value});


         dbSentence = await sentence.addSentence();
         
        return res.status(200).send({
            message: "Sentence Saved Successfully",
            sentenceDetails: {
                sentenceId: dbSentence.uuid,
                standard: dbSentence.standard,
                bookName: he.decode(dbSentence.bookName),
                chapter: dbSentence.chapter,
                sequence: dbSentence.sequence,
                position: dbSentence.position,
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
        

        
        let { sentenceId, standard, chapter, bookName, sequence, position, value } = req.body;
        
        standard = parseInt(standard);
        chapter = parseInt(chapter);
        sequence = parseInt(sequence);
        position = parseInt(position);
            
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

        const objectOfSentenceModel = new sentenceModel({ userId, sentenceId, standard, chapter, bookName, sequence, position, value }); 
        
         dbSentence = await objectOfSentenceModel.updateSentence();
           return res.status(200).send({
             message: "Sentence Updated Successfully",
             sentenceDetails: {
                 sentenceId: dbSentence.uuid,
                 standard: dbSentence.standard,
                 bookName: he.decode(dbSentence.bookName),
                 chapter: dbSentence.chapter,
                 sequence: dbSentence.sequence,
                 position: dbSentence.position,
                 value: he.decode(dbSentence.value)
             }
 
               })



    }
    catch (err)
    {
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


export default adminFunctions;