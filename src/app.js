const express = require("express")

const app = express()
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

app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");//if you write just this line then this will get logged but no response in the postman it will keep on running 
    // res.send("this is the first response")
    next();
    
    },
    (req,res,next)=>{
        console.log("2nd handeler");
        // res.send("this is the 2nd response")
        next()
        
    },
    (req,res,next)=>{
        console.log("3d handeler");
        // res.send("this is the 2nd response")
        next()
        
    },
    (req,res,next)=>{
        console.log("4th handeler");
        // res.send("this is the 4th response")
        next()
        
    }

)
app.listen(3000,()=>{
    console.log("server succesffuly listening on port 300"); 
})
