import hindiCollection from "../schemas/hindiSchema.js";

let hindiSentenceModel = class {
    
    englishSentenceId;
    hindiSentenceId;
    hindi;
    hindiExplain;
    creationDateTime;
    userId;

    constructor({ englishSentenceId, hindiSentenceId, hindi,creationDateTime, hindiExplain,userId }) {
         
        this.englishSentenceId = englishSentenceId;
        this.hindiSentenceId= hindiSentenceId;
        this.hindi=hindi;
        this.hindiExplain = hindiExplain;
        this.creationDateTime = creationDateTime;
        this.userId = userId;
    }


    addHindiTanslate() {
        
        return new Promise(async (resolve, reject) => {
            
           


            try {
                
                const hindiTranslate = new hindiCollection({
                    englishSentenceId: this.englishSentenceId,
                    hindi: this.hindi,
                    userId:this.userId,
                    ...(this.hindiExplain && { hindiExplain: this.hindiExplain }),
                    creationDateTime:this.creationDateTime,
                   
                }) 


                const dbHindiSentence = await hindiTranslate.save();
                return resolve(dbHindiSentence);
            }
            catch (error) {
                
                return reject(error)
            }
        })
    }






    updateHindiTranslate() {
        
         
        return new Promise(async (resolve, reject) => {
            
            try {
                const objectOfAvailableFields = {
                    ...(this.hindi && { hindi :this.hindi}),
                    ...(this.hindiExplain && { hindiExplain:this.hindiExplain})
                }
                
                const dbHindiSentence = await hindiCollection.findOneAndUpdate({uuid: this.hindiSentenceId,userId:this.userId},objectOfAvailableFields,{ returnDocument: 'after' });
                return resolve(dbHindiSentence);
           
            }
            catch (error) {
                return reject(error)
            }
        })
    }


    static findHindiSentenceById({ hindiSentenceId }) {
        
        return new Promise(async (resolve, reject) => {
            
            try{
                const dbHindiSentence= await hindiCollection.findOne({uuid:hindiSentenceId});
                return resolve(dbHindiSentence);
            } catch (err) {
                 
                return reject(err);
            }
        })
    }



 deleteHindiTranslate() {
     

        return new Promise(async(resolve,reject)=>{
            try {
                 
                const dbHindiSentence = await hindiCollection.findOneAndDelete({ uuid: this.hindiSentenceId,userId:this.userId });
                console.log(dbHindiSentence);
            return resolve(dbHindiSentence);
            }
            catch(err){
                return reject(err);
            }
        })
}

    
    static countAddedHindi({ englishSentenceId, userId }) {
        return new Promise(async (resolve, reject) => {
            try {
                const count = await hindiCollection.countDocuments({ englishSentenceId, userId });
                return resolve(count);
            }
            catch (err) {
                return reject(err);
            }
        })
    }


    static findHindiBook({ query }) {
        return new Promise(async (resolve, reject) => {
            
            try {
                
            
                const book = await hindiCollection.aggregate([
                    {
                        $lookup: {
                            from: 'sentences',
                            localField: 'englishSentenceId',
                            foreignField: 'uuid',
                            as: 'student'
                        }
                    },
                    {
                        $unwind: {
                            path: '$student',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            'student.sequence': 1
                        }
                    }
                ])
                console.log(book);
                resolve(book);

            }
            catch (err)
            {
                return reject(err);
            }

        })
    }
}


export default hindiSentenceModel;
