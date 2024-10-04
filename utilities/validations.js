//const ObjectId = require('mongodb').ObjectId
import { ObjectId } from 'mongodb';
import validator from 'validator';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

const validationFunctions = {};
validationFunctions.validateMongoDbIds= (ids)=>
{
    for(let id of ids){
        if(!id)
        {
            return false;
        }
        if(!ObjectId.isValid(id))
        {
            return false;
        }
    }
    return true;
}

 
validationFunctions.removeExtraWhitaspace = (sentence)=> {
    

    return  sentence.replace(/\s+/g,' ').trim();

}



validationFunctions.checkIfAnyFieldEmpty= (fields)=> {
    
    for (let field of fields)
    {
         
        
        if (typeof (field) === 'string')
        {
            field = field.trim();
        }
        
        if (!field) {
            return false;
        }
        
    }
    return true;
}

validationFunctions.cleanUpUserDetails = ({email, username, password, name, phoneNumber, profilePic, addressLine,village,postOffice,policeStation,dist,state,country,pin }) => {
    
    return new Promise((resolve, reject) => {
        try {
            const nameRegEx = /^[a-zA-Z ]+$/;
            const addressFieldRegEx=/^[a-zA-Z]+$/
             
            if(email &&typeof(email)!=="string"){
                return reject(new Error("Invalid email"));
            }
            if(email && !validator.isEmail(email)){
                return reject(new Error("Invalid email"));
    
            }
            
            if(username && username.length<3){
                return reject(new Error("Invalid username"));
    
            }
            if(username && username.length>30){
                return reject(new Error("Invalid username"));
    
            }
            if (username && !validator.isAlphanumeric(username.replace(/_/g, '')) && !validator.isWhitelisted(username, 'a-zA-Z0-9_'))
            {
                console.log(username);
                return reject(new Error("Invalid username"));
             }

            if(phoneNumber&& phoneNumber.length!==10   )
            {
                 
                return reject(new Error("Invalid Phone Number"));
            }
            if(phoneNumber && !validator.isNumeric(phoneNumber)){
                return reject(new Error("Invalid Phone Number"));
            }
            
            if(password &&( password.length<8||password.length > 30))
            {
                return reject(new Error("Invalid Password"));
            }
             
            
            if (name && !nameRegEx.test(name)) {
                return reject(new Error("Invalid Name"));
            }
            
            if (profilePic && !validator.isURL(profilePic))
            {
                return reject(new Error("Invalid profile pic url"));
                }
            if (addressLine && !nameRegEx.test(addressLine))
            {
                return reject(new Error("Invalid Address "));
            }
            if (village && !addressFieldRegEx.test(village))
            {
                return reject(new Error("Invalid village"));
            }
            if (postOffice && !addressFieldRegEx.test(postOffice))
            {
                return reject(new Error("Invalid Post Office"));
            }
            if (policeStation && !addressFieldRegEx.test(policeStation))
            {
                return reject(new Error("Invalid Police Station"));
            }
            if (dist && !addressFieldRegEx.test(dist))
            {
                return reject(new Error("Invalid District"));
            }
            if (state && !addressFieldRegEx.test(state))
            {
                return reject(new Error("Invalid State"));
            }
            if (country && !addressFieldRegEx.test(country))
            {
                return reject(new Error("Invalid Country"));
            }
            if (pin && !validator.isNumeric(pin))
            {
                return reject(new Error("Invalid pin"));
            }
            
            return resolve();
    
        }
        catch (err) {
            
            return reject(err);
        }
       
    });

}

validationFunctions.validateUUID=(ids)=>
{

    for (let id of ids) {
         
        if(!id)
        {
            return false;
        }
      
        if(!uuidValidate(id) && !uuidVersion(id) === 4)
        {

            return false;
        }
    }
    return true;
}

validationFunctions.organiseSentence=(sentence)=>{
    let lowerCaseSentence = sentence.toLowerCase();
    let capitalizedSentence = lowerCaseSentence.charAt(0).toUpperCase() + lowerCaseSentence.slice(1);
    // if (!capitalizedSentence.endsWith('.')) {
    //     capitalizedSentence += '.';

    // }
    return capitalizedSentence;

}
export default validationFunctions;