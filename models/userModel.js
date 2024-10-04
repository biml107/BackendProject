import userCollection from "../schemas/userSchema.js";
import validator from "validator";


let userModel = class {
    userId;
    username;
    email;
    password;
    phoneNumber;
    name;
    profilePic;
    addressLine;
    village; postOffice; policeStation; dist; state; country; pin;
    constructor({userId,username,name,email,password,phoneNumber,profilePic,addressLine,village,postOffice,policeStation,dist,state,country,pin}){
        this.userId = userId;
        this.username = username;
        this.name=name;
        this.email=email;
        this.password=password;
        this.phoneNumber=phoneNumber;
        this.profilePic = profilePic;
        this.addressLine = addressLine;
        this.village = village;
        this.postOffice = postOffice;
        this.policeStation = policeStation;
        this.dist = dist;
        this.state = state;
        this.country = country;
        this.pin = pin;
    }
 //in static function me jo v arguments honge we have pass it as parameter becoz object is not created for the class and cant access the class member variables
 //static functions can b called without object   
 static verifyUsernameAndEmailExists({username,email})
    {
        return new Promise(async (resolve,reject)=>
        {
            try{
                   const dbUser = await userCollection.findOne({$or: [{username},{email}]});//search for short hand object notation
                   // findone fn -if exist it return the object and if not exist it returns null

                return resolve(dbUser);

            }
            catch(err){
                        return reject(err);
            }
        })
    }


    static verifyUserIdExists(userId) {
        
        return new Promise(async(resolve,reject)=>{

            try{
                const dbUser=await userCollection.findOne({uuid:userId});
                if(!dbUser)
                {
                    return reject("User doesnt exist");
                }
               // console.log(dbUser);
                resolve(dbUser);

            }
            catch(err){
                    return reject(err);
            }

        })
    }
    //registration function
    registerUser(){
        
        return new Promise(async(resolve,reject)=>{
           
            try {
                
                // const address = {
                //     ...(this.addressLine && { addressLine: this.addressLine }),
                //     ...(this.village && { village: this.village }),
                //     ...(this.postOffice && { postOffice: this.postOffice }),
                //     ...(this.policeStation && { policeStation: this.policeStation }),
                //     ...(this.dist && { dist: this.dist }),
                //     ...(this.state && { state: this.state }),
                //     ...(this.country && { country: this.country }),
                //     ...(this.pin && {pin : this.pin }),
                // }
                
            const user= new userCollection({

                username:this.username,
                email: this.email,
                name:this.name,
                password:this.password,
               phoneNumber: this.phoneNumber,
                ...(this.profilePic && { profilePic: this.profilePic }),
                ...(this.addressLine && { 'address.addressLine': this.addressLine }),
                ...(this.village && { 'address.village': this.village }),
                ...(this.postOffice && { 'address.postOffice': this.postOffice }),
                ...(this.policeStation && { 'address.policeStation': this.policeStation }),
                ...(this.dist && { 'address.dist': this.dist }),
                ...(this.state && { 'address.statee': this.state }),
                ...(this.country && { 'address.country': this.country }),
                ...(this.pin && { 'address.pin': this.pin }),
                    
               
               
            })
           
           
                 
                const dbUserSave= await user.save();
           
                return resolve(dbUserSave);
            }
            catch(err){
                
                    return reject(err);
            }

        })
    }

    //update user
    
    updateUser() {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                
                //console.log(this.postOffice);
                const objectOfAvailableFields = {
                    ...(this.email && { email :this.email}),
                    ...(this.username && { username: this.username }),
                    ...(this.name && { name: this.name }),
                    ...(this.phoneNumber && { phoneNumber: this.phoneNumber }),
                    ...(this.profilePic && { profilePic: this.profilePic }),
                    ...(this.addressLine && { 'address.addressLine': this.addressLine }),
                    ...(this.village && { 'address.village': this.village }),
                    ...(this.postOffice && { 'address.postOffice': this.postOffice }),
                    ...(this.policeStation && { 'address.policeStation': this.policeStation }),
                    ...(this.dist && { 'address.dist': this.dist }),
                    ...(this.state && { 'address.statee': this.state }),
                    ...(this.country && { 'address.country': this.country }),
                    ...(this.pin && {'address.pin' : this.pin }),
                }
                 
                
               // console.log(objectOfAvailableFields);

                const dbUserUpdate = await userCollection.findOneAndUpdate({ uuid: this.userId }, { $set:objectOfAvailableFields },{ returnDocument: 'after' });
                return resolve(dbUserUpdate);

            }
            catch (err) {
                return reject(err);
            }
        })
    }


    //

    static findUsersWithUsername(username) {
        return new Promise(async (resolve, reject) => {
            let dbUsers;
            try {
                dbUsers = await userCollection.find({ "username": { $regex: new RegExp(username) } });//this method match username contains the string
                

            } catch (err)
            {
                return reject(new Error("Database error whils getting users by userename"));
            }
            if (!dbUsers)
            {
                return reject(new Error("No user Found"));
            }
            resolve(dbUsers);
        })
    }
    //////////////////////////////////////////////////////////
    static findUserWithLoginId(loginId){

        return new Promise(async(resolve,reject)=>{
            try{
            let dbUser;
            
                if(validator.isEmail(loginId)){

                    dbUser = await userCollection.findOne({email:loginId});
                }
                else{
                    dbUser = await userCollection.findOne({username:loginId});
                }

                resolve(dbUser);

            }
            catch(err)
            {
                return reject(new Error(err.message));
            }
            
        
        })
    }




    

    

    

    static verifyUsernameAlreadyTaken({ username }) {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                
                const dbUser = await userCollection.findOne({ username });
                if (!dbUser)
                    return resolve();

                else {
                    return reject("Username Already Taken by someone else");
                }
            }
            catch (err) {
                return reject("Database Error");
            }
        })
        
    }

    static verifyEmailAlreadyTaken({ email }) {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                
                const dbUser = await userCollection.findOne({ email });
                if (!dbUser)
                    return resolve();

                else {
                    return reject("Emial is already registered to someone else");
                }
            }
            catch (err) {
                return reject("Database Error");
            }
        })
        
    }

    static getProfile({ userId }) {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                
                const dbUser = await userCollection.findOne({uuid:userId });
                if (!dbUser)
                
                    return reject(new Error("No User Found"));

              
                    return  resolve(dbUser);
                
            }
            catch (err) {
                return reject("Database Error");
            }
        })
    }


    static getBook() {
        return new Promise(async (resolve, reject) => {
            
            try {
                
                
            }
            catch (err)
            {
                return reject(err)
            }
        })
    }

    

}
export default userModel;