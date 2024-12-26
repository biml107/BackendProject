import sentenceCollection from "../schemas/sentenceSchema.js";
import hindiCollection from "../schemas/hindiSchema.js";


let Sentence = class {
    userId;
    sentenceId;
    chapterId;
    sequence;
    paragraphPosition;
    value;
    hindi;
    constructor({ sentenceId, chapterId, sequence, paragraphPosition, value,userId }) {
        this.userId = userId;
        this.sentenceId = sentenceId;
        this.chapterId=chapterId;
        this.sequence=sequence;
        this.paragraphPosition=paragraphPosition;
        this.value = value;
        
    }


    addSentence() {
        
        return new Promise(async (resolve, reject) => {
           

            try {
                 const sentence = new sentenceCollection({
                    userId: this.userId,
                    chapterId: this.chapterId,
                    sequence: this.sequence,
                    paragraphPosition: this.paragraphPosition,
                    value: this.value
    
    
                })

                const dbSentence = await sentence.save();
                return resolve(dbSentence);

            }
            catch (err) {
             
                return reject(err);
            }



        })
    }



    updateSentence() {
        
          return new Promise(async (resolve, reject) => {
            
            try {

                const objectOfAvailableFields =
                {
                    
                    ...(this.chapterId && { chapterId:this.chapterId }),    
                    ...(this.sequence && { sequence:this.sequence }), 
                    ...(this.paragraphPosition && { positparagraphPositionion:this.paragraphPosition }), 
                    ...(this.value && { value: this.value})

                  }
    
     //handling edge case , reducing database call if no any value to update 
                        if (Object.keys(objectOfAvailableFields).length === 0) {
                            return res.status(400).send({
                                message: "Nothing to update"
                            })
                        }

//if something available for update
                const dbSentence = await sentenceCollection.findOneAndUpdate({uuid:this.sentenceId},objectOfAvailableFields,{ returnDocument: 'after' });
                return resolve(dbSentence);
           
            }
            catch (error) {
                return reject(error)
            }
        })
    }

    static findSentenceById({ sentenceId }) {
        
        return new Promise(async(resolve,reject)=>{

            try{
                const dbSentence = await sentenceCollection.findOne({ uuid: sentenceId });
                //console.log(dbSentence);
                return resolve(dbSentence);
            }catch(err){
                return reject(err);
            }
        })

    }

    deleteSentence() {
         //in this later i have to implement the reference key facility . before deleting i have to check if any reference present in hindi and explaination collection deletion should notallow
        return new Promise(async(resolve,reject)=>{
            try{
            const dbSentence= await sentenceCollection.findOneAndDelete({uuid:this.sentenceId});
            return resolve(dbSentence);
            }
            catch(err){
                return reject(err);
            }
        })
    }
    

    

    static checkIfSentenceAlreadyPresent({ query }) {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const dbSentence = await sentenceCollection.findOne(query);

                return resolve(dbSentence);
            }
            catch (error) {
                
                return reject(error);
    
            }

        })
       
    }



   static findSentences({query,limit,skip}) {
        
       return new Promise(async (resolve, reject) => {
           
           try {
               
               const dbSentences = await sentenceCollection.find( query,{_id:0,userId:0,__v:0} )
                   .sort('sequence')
                   .skip(skip)
                   .limit(limit);
                
               return resolve(dbSentences);


           }
           catch (error)
           {
               
               return reject(error);
           }
       })
       
    }

    static findHeighestSequence({chapterId}) {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                 
                const highestSequenceDoc = await sentenceCollection.findOne({chapterId}).sort({ sequence: -1 }).limit(1).exec();
                
                return resolve(highestSequenceDoc ? highestSequenceDoc.sequence : 0);
                
 
 
            }
            catch (error)
            {
                
                return reject(error);
            }
        })
        
     }

    static getEnglishBookWithHindi({ query, skip, limit }) {
        return new Promise(async (resolve, reject) => {
            
            try {
                
                const bookWithHindi = sentenceCollection.aggregate([
                    {
                        $match:query
                    },
                    {
                        $project: {
                            userId: 1,
                            value: 1,
                            uuid: 1,
                            _id: 0,
                            sequence:1
                        }
                    },
                    {
                        $lookup: {
                            from: 'hindis',
                            localField: 'uuid',
                            foreignField: 'englishSentenceId',
                            as:'translates'
                        }
                    },
                    {
                        $addFields: {
                            translates: {
                                $map: {
                                    input: '$translates',
                                    as: 'translate',
                                    in: {
                                        hindi: '$$translate.hindi',
                                        hindiExplain: '$$translate.hindiExplain',
                                        userId: '$$translate.userId',
                                        userId: '$$translate.userId',
                                        hindiSentenceId:'$$translate.uuid'
                                    }
                                }
                            }
                        }
                    },
                    {
                      $sort:{sequence:1}
                    },
                    {
                        $skip:skip
                    }, {
                        $limit:limit
                    }
                ])

                return resolve(bookWithHindi);
            }
            catch (err) {
                return reject(err);
            }
        })
    }

}

export default Sentence;