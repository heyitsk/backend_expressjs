const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://kushagradpr:ipzHZS8FROU1ca7R@learningnode.jvcpg.mongodb.net/") 
// not a good way as this returns you a promise so you can use async await and use .then and .catch


const connectCLuster = async()=>{
    await mongoose.connect("mongodb+srv://kushagradpr:ipzHZS8FROU1ca7R@learningnode.jvcpg.mongodb.net/DevTinder") 
}


module.exports = connectCLuster 