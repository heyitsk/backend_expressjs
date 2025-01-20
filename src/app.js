const express = require("express")
const {adminAuth,userAuth} = require("./middleware/auth.js")
const connectCluster = require("./config/database.js")
const User = require("./models/user.js")
const app = express()
const {signUpDataValidation} = require("./utils/validation.js")
const bcrypt = require("bcrypt")
//this creates an express js application 



// app.use("/test",(req,res)=>{
//     res.send("hello from test page")
// })

// app.use("/hello",(req,res)=>{
//     res.send("hello from hello page")
// })
// app.use("/",(req,res)=>{
//     res.send("hello from the server")
// })

// app.get("/user/:userId/:name/:age",(req,res)=>{
//     // console.log(req.query);
//     console.log(req.params);
    
    
//     res.send({
//         "firstname":"kushagra",
//         "lastname":"agarwal"
//     })

// })
// app.post("/user",(req,res)=>{
//     //saving data to database logic 
//     res.send("data saved successfully")
// })
// app.delete("/user",(req,res)=>{
//     //deleting user logic
//     res.send("user deleted successfully")
// })




// app.get("/user",
//     (req,res,next)=>{
//     console.log("1st handeler");//if you write just this line then this will get logged but no response in the postman it will keep on running 
//     // res.send("this is the first response")
//     next();
    
//     },
//     (req,res,next)=>{
//         console.log("2nd handeler");
//         // res.send("this is the 2nd response")
//         next()
        
//     },
//     (req,res,next)=>{
//         console.log("3d handeler");
//         // res.send("this is the 2nd response")
//         next()
        
//     },
//     (req,res,next)=>{
//         console.log("4th handeler");
//         // res.send("this is the 4th response")
//         next()
        
//     }

// )
// app.use("/admin",adminAuth)
// app.get("/admin/getAllData",(req,res,next)=>{
//     res.send("all data sent")
// })
// app.get("/admin/deleteAllData",(req,res)=>{
//     //logic to delete data
//     res.send("All data dlt")
// })
// app.get("/user",userAuth,(req,res)=>{
//     try{
//     //logiv for db calls and other stuff
//     throw new Error("asjbdaksdalksdbasl")
//     res.send("user data sent")
//     }
//     catch(err){
//         res.status(500).send("unable to send data")
//     }
// })
// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("something went wrong")
//     }
// })
app.use(express.json())
app.post("/signup",async (req,res)=>{
    // console.log(req.body);   
    const {firstName, lastName, password, emailId}= req.body

    //encrypt the passwword 
    const passwordHash = await bcrypt.hash(password,10)


    const user = new User({
        firstName,
        lastName,
        password:passwordHash,
        emailId
    }) //we are creating a new instance of a user model 

    //whenver you are doing DB calls always do then inside try catch 
    try{
    signUpDataValidation(req) //we are adding this in the try catch block bcz the error it throws will be handeled by the catch blocks

        await user.save() //since it returns a promise so use async await 
        res.send("user added succesfully")
    }
    catch(err){
        res.status(400).send("error: "+err.message)
    }
})

//get users by email id
app.get("/signup",async (req,res)=>{
    const userEmail = req.body.emailId
    // console.log(userEmail);
    try{
    const userList = await User.find({emailId:userEmail}) 
    //.find returns an array of object whereas .findOne returns one single object 
    if(userList.length===0){
        res.send("unable to find the user")
    }
    else{
        res.send(userList)
    }
    }
    catch(err){
        res.status(400).send("cannot find user")
    }

})
//get users by email id using findOne. 
//IF two entries with same email id are present it'll return the oldest entry with that email id 
// app.get("/signup",async (req,res)=>{
//     const userEmail = req.body.emailId
//     try{
//     const user = await User.findOne({emailId:userEmail})
//     if(!user){
//         res.send("unable to find the user")
//     }
//     else{
//         res.send(user)
//     }
//     }
//     catch(err){
//         res.status(400).send("cannot find user")
//     }

// })

//get user by _id
// app.get("/signup",async (req,res)=>{
//     // const userId = req.body._id
//     console.log(userId);
//     try{
//     const user = await User.findById({_id:userId}) 
//     //.find returns an array of object whereas .findOne returns one single object 
//     if(!user){
//         res.send("unable to find the user")
//     }
//     else{
//         res.send(user)
//     }
//     }
//     catch(err){
//         res.status(400).send("cannot find user")
//     }

// })


//get all users /feed api 
app.get("/feed",async (req,res)=>{
    try{
    const allUser = await User.find({}) //this will give all documents from the database 
    res.send(allUser)
    }
    catch(err){
        res.status(400).send("cannot find users")

    }

})

//delete user by _id 
app.delete("/user",async(req,res)=>{
    const userId = req.body._id
    try{

        const user = await User.findByIdAndDelete({_id:userId})
        res.send("user deleted")
    }
    catch(err){
        res.send("some error ocurred cannot delete the user")
    }
})

app.post("/login",async (req,res)=>{
    //work flow -> it checks if email present in db -> if yes then it checks if password matches
    try{
        const {emailId, password} = req.body
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("email not present in db")
        }
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(isPasswordValid){
            res.send("login successfull")
        }
        else{
            throw new Error("password does not match")
        }
    }
    catch(err){
        res.status(400).send("error: "+err.message)
    }
})

//update data fo the user using pathc
app.patch("/user/:userId",async(req,res)=>{
    const data = req.body
    const userId= req.params.userId
    try{
        const UPDATES_ALLOWED = ["firstName","lastName","gender","about","password","skills"]
        const isAllowed = Object.keys(data).every((key)=>UPDATES_ALLOWED.includes(key))
        if(!isAllowed){
            throw new Error("update not allowed")
        }
        if(data.skills.length>5){
            throw new Error("skills cannot be more than 5")
        }
         const userInfo = await User.findByIdAndUpdate({_id:userId},data,
            {returnDocument:"after",
                runValidators:true
            },
            
        )
        // console.log(userInfo);
        
        
        res.send("data updates succesfully")
    
    }
    catch(err){
        res.status(400).send("update not allowed"+"-"+err.message)
    }
}) //this does not update the _id field bcz its not present in the schema of the model. SO anything let's suppose you try to add another fields while updating which are not in the schema it'll ignore all of them 

connectCluster()
    .then(()=>
        {
            console.log("cluster connection established");
            app.listen(3000,()=>{
                console.log("server succesffuly listening on port 300"); 
            })
    })
    .catch((err)=>
        {console.log("cluster cannot be connected");
    })

