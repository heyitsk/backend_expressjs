const express = require("express")

const app = express()
//this creates an express js application 



app.use("/test",(req,res)=>{
    res.send("hello from test page")
})

app.use("/hello",(req,res)=>{
    res.send("hello from hello page")
})
app.use("/",(req,res)=>{
    res.send("hello from the server")
})

app.listen(3000,()=>{
    console.log("server succesffuly listening on port 300");
    
})
