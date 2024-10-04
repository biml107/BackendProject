import fs from 'fs'
let errorLogger = (err, req, res, next) => {
    let errMessage = `${new Date()} - ${err.stack}\n`
    fs.appendFile('./errorLogger.txt', errMessage, (error) => {
        if (error) console.log("logging error failed")
        else {
            err.status ? res.status(err.status) : res.status(500)
            res.json({ message: err.message })
        }
    })
}

export {errorLogger} 









