const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        unique:true,
        minLength:4,
        // maxLength:30
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        // validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error("password not strong"+value)
        //     }
        // }
    },
    age:{
        type:Number,
        min:18

    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid photo url:")
            }
        }
    },
    about:{
        type:String,
        default:"this is a default description of the user"
    },
    skills:{
        type:[String]
    },
},
{
    timestamps:true,
    //this enables mongoose to record the timestamp at which the request was made to create the documennt and at what time the document was updated
})
//NOTE:- never use arrow funtion for scehma methods
userSchema.methods.getJWT = async function (){
    const user = this //it points to that particular instanse of the user model which we are loggin in from

   const token = await jwt.sign({_id:user._id},"KUSH@1234#",{expiresIn:"1d"})
   return token;
}
userSchema.methods.validatePassword = async function(passwordEnteredByUser){
    const user = this
    const passwordHash = user.password
    const isPasswordValid = bcrypt.compare(passwordEnteredByUser,passwordHash)
    return isPasswordValid
}
const User = mongoose.model("User",userSchema)

module.exports = User 
//this is how you create a model and once the model is created you'll create new instances of it. Ex:- a new user with a name arun logs in now he'll have a new instance of this user model and likewise 