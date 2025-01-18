const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:Number
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User 
//this is how you create a model and once the model is created you'll create new instances of it. Ex:- a new user with a name arun logs in now he'll have a new instance of this user model and likewise 