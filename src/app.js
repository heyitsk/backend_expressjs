const express = require("express")
const connectCluster = require("./config/database.js")
const app = express()
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
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
app.use(cookieParser())

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const feedRouter = require("./routes/feed.js")
const connectionRouter = require("./routes/connectionRequest.js")
const userRouter = require("./routes/user.js")


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",feedRouter)
app.use("/",connectionRouter)
app.use("/",userRouter)



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

