const validator = require("validator")

const signUpDataValidation = (req)=>{
    const data = req.body
    const {firstName, lastName, password, emailId} = data
    if(!firstName || !lastName){
        throw new Error("username is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("not a valid email address")
    }
}

const profileEditDataValidation = (req)=>{
    const data = req.body
    const allowedFields = ["firstName","lastName","age","gender","about","skills"]
    const isEditAllowed = Object.keys(data).every(field=>allowedFields.includes(field))
    return isEditAllowed

}
module.exports={signUpDataValidation, profileEditDataValidation}