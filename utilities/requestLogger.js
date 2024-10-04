import fs from 'fs'

let requestLogger = (req, res, next) => {
    
    let logMessage = `${new Date()} - ${req.method} - ${req.path}\n`;
    fs.appendFile('./requestLogger.txt', logMessage, (err) => {
        if(err) next(err);
        else next();
    })
}

export {requestLogger} 