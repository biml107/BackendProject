import sentenceCollection from "../schemas/sentenceSchema.js";
import hindiCollection from "../schemas/hindiSchema.js";


let Sentence = class {
    userId;
    sentenceId;
    standard;
    bookName;
    chapter;
    sequence;
    position;
    value;
    hindi;
    constructor({ sentenceId, standard, bookName, chapter, sequence, position, value,userId }) {
        this.userId = userId;
        this.sentenceId = sentenceId;
        this.standard= standard;
        this.bookName=bookName;
        this.chapter=chapter;
        this.sequence=sequence;
        this.position=position;
        this.value = value;
        
    }


    addSentence() {
        
        return new Promise(async (resolve, reject) => {
           

            try {
                 const sentence = new sentenceCollection({
                    userId: this.userId,
                    standard: this.standard,
                    bookName: this.bookName,
                    chapter: this.chapter,
                    sequence: this.sequence,
                    position: this.position,
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
                    ...(this.standard && { standard:this.standard }),
                    ...(this.chapter && { chapter:this.chapter }),    
                    ...(this.bookName && { bookName: this.bookName }), 
                    ...(this.sequence && { sequence:this.sequence }), 
                    ...(this.position && { position:this.position }), 
                    ...(this.value && { value: this.value})

                  }
    
     
                        if (Object.keys(objectOfAvailableFields).length === 0) {
                            return res.status(400).send({
                                message: "Nothing to update"
                            })
                        }


                const dbSentence = await sentenceCollection.findOneAndUpdate({uuid:this.sentenceId, userId:this.userId},objectOfAvailableFields,{ returnDocument: 'after' });
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
         
        return new Promise(async(resolve,reject)=>{
            try{
            const dbSentence= await sentenceCollection.findOneAndDelete({uuid:this.sentenceId, userId:this.userId});
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