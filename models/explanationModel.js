import explanationCollection from "../schemas/explanationSchema.js";

let explanationModel = class {
    
    explanationId;
    englishSentenceId;
    simpleEnglish;
    simpleEnglishHindi;
    englishExplain;
    explainWithGrammer;
    creationDateTime;
    userId;

    constructor({explanationId,englishSentenceId,simpleEnglish,simpleEnglishHindi,englishExplain,explainWithGrammer,creationDateTime,userId }) {
        
        this.explanationId = explanationId;
        this.englishSentenceId = englishSentenceId;
        this.simpleEnglish = simpleEnglish;
        this.simpleEnglishHindi = simpleEnglishHindi;
        this.englishExplain = englishExplain;
        this.explainWithGrammer = explainWithGrammer;
        this.creationDateTime = creationDateTime;
        this.userId = userId;

    }


    addExplanation() {
        
        return new Promise(async(resolve, reject) => {
            
            try {
                
                const explanationObject = new explanationCollection({
                         
                    englishSentenceId: this.englishSentenceId,
                    simpleEnglish: this.simpleEnglish,
                    simpleEnglishHindi: this.simpleEnglishHindi,
                    englishExplain: this.englishExplain,
                    explainWithGrammer: this.explainWithGrammer,
                    creationDateTime: this.creationDateTime,
                    userId:this.userId
                })
                
                const dbExplanation = await explanationObject.save();
                return resolve(dbExplanation);

            }
            catch (error)
            {
                return reject(error)
            }

        })
    }


    updateExplanation() {
        
         
        return new Promise(async (resolve, reject) => {
            
            try {
                const objectOfAvailableFields = {
                    ...(this.simpleEnglish && { simpleEnglish :this.simpleEnglish}),
                    ...(this.simpleEnglishHindi && { simpleEnglishHindi: this.simpleEnglishHindi }),
                    ...(this.englishExplain && { englishExplain: this.englishExplain }),
                    ...(this.explainWithGrammer && { explainWithGrammer: this.explainWithGrammer}),

                }
                
                const dbExplain = await explanationCollection.findOneAndUpdate({uuid: this.explanationId,userId:this.userId},objectOfAvailableFields,{ returnDocument: 'after' });
                return resolve(dbExplain);
           
            }
            catch (error) {
                return reject(error)
            }
        })
    }



    deleteExplanation() {
     

        return new Promise(async(resolve,reject)=>{
            try {
                 
                const dbExplanation = await explanationCollection.findOneAndDelete({ uuid: this.explanationId ,userId:this.userId});
               
            return resolve(dbExplanation);
            }
            catch(err){
                return reject(err);
            }
        })
}


static findExplanationById({ explanationId }) {
        
    return new Promise(async (resolve, reject) => {
        
        try{
            const dbExplanation= await explanationCollection.findOne({_id:explanationId});
            return resolve(dbExplanation);
        } catch (err) {
             
            return reject(err);
        }
    })
}

    
    
 
    

    static findExplanationByUserId({userId}) {
        return new Promise(async (resolve, reject) => {
            
            try {
                
                const dbExplanations = await explanationCollection.find({ userId:userId });
                return resolve(dbExplanations);
            }
            catch (err) {
               return reject(err);
            }
        })

    }

    static findExplanationByUserIdAndEnglishSentenceId({userId,englishSentenceId}) {
        return new Promise(async (resolve, reject) => {
            
            try {
                
                const countDbExplanations = await explanationCollection.find({ englishSentenceId: englishSentenceId, userId: userId });
                return resolve(countDbExplanations);
            }
            catch (err) {
                return reject(err);
            }
        })

    }

    static countExplanationByUserIdAndEnglishSentenceId({userId,englishSentenceId}) {
        return new Promise(async (resolve, reject) => {
            
            try {
                
                const countDbExplanations = await explanationCollection.countDocuments({ englishSentenceId: englishSentenceId, userId: userId });
                return resolve(countDbExplanations);
            }
            catch (err) {
                return reject(err);
            }
        })

    }


}

export default explanationModel;