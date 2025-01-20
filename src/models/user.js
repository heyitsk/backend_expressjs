const mongoose = require("mongoose")
const validator = require("validator")

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
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address:"+value)
            }
        }
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

const User = mongoose.model("User",userSchema)

module.exports = User 
//this is how you create a model and once the model is created you'll create new instances of it. Ex:- a new user with a name arun logs in now he'll have a new instance of this user model and likewise 