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

app.get("/user/:userId/:name/:age",(req,res)=>{
    // console.log(req.query);
    console.log(req.params);
    
    
    res.send({
        "firstname":"kushagra",
        "lastname":"agarwal"
    })

})
app.post("/user",(req,res)=>{
    //saving data to database logic 
    res.send("data saved successfully")
})
app.delete("/user",(req,res)=>{
    //deleting user logic
    res.send("user deleted successfully")
})
app.listen(3000,()=>{
    console.log("server succesffuly listening on port 300");
    
})
