we have to create a sever (express server) so that it "listens" to the request from client side and listen on a port so that anyone can connect 
``` js
app.use((req,res)=>{
    res.send("hello from the server")
}) 
///this function is called a response handler
//NOTE :- the first parameter should be req and the second res 
```



```js
app.use("/",(req,res)=>{
    res.send("hello from the server")
})

app.use("/test",(req,res)=>{
    res.send("hello from test page")
})

app.use("/hello",(req,res)=>{
    res.send("hello from hello page")
}) 
```
if you use this order the issue is with .use method 
even if you change the port to /hello or /test it shows "hello from the server" bcz it reads any routes that start with "/" and show hello from the server  
also if you remove 1st handelerand  write /hello/abc it will show hello from hello page bcz this handler handeles anything after this route bcz it starts with /hello  
why?  
bcz .use matches the "/" first and  shows it in the hello and test port  
fix
1. .use-> .get  
app.use("/test") will match all method api calls to /test. ex /test/xyz 
app.get("/test") will only handle get call to /test
2. change the order. It matter bcz when theres a request on the serever it starts reading the code from the top first it checks if there is /test than /hello and then / so this will work file bcz above 2 don't match the 3rd as they have soem extraa infoa s well apart from just / so it will go to the 3rd one 




### Advanced hashing technique 
1. /ab?c -> means b is optional. abc will work and ac will work 
2. /ab+c -> means you can add b number of times. abc will work  and abbbbbbbbbbbbbbc will work
3. /ab*cd -> means you you can add anything btw ab and cd. abcd will work and abaskkjdaldalksdaskdadcd will work 
4. /a(bc)?d -> you can group like this means bc is optional
5. /a(bc)+d -> abcbcbcd will work 
YOU can write regex instead of strings 
6. /a/ -> means it will run anywhere a exists in the url like /a or /cap
7. /.*fly$/ -> means any url that ends with fly will run like /fly or /butterfly 


```js
app.get("/user",(req,res)=>{
    console.log(req.query); //this is how you read what's sent throught the url
    res.send({
        "firstname":"kushagra",
        "lastname":"agarwal"
    })

})
```
to make the routes dynamic like /user/101 
```js
app.get("/user/:userId",(req,res)=>{
    console.log(req.params); //this will print { userId: '101' }
    
    
    res.send({
        "firstname":"kushagra",
        "lastname":"agarwal"
    })

})
```
Route path: /plantae/:genus.:species  
Request URL: http://localhost:3000/plantae/Prunus.persica



```js
app.get("/user",
    (req,res)=>{
    console.log("1st response");
    res.send("this is the first response")
    
    },
    (req,res)=>{
        console.log("2nd response");
        res.send("this is the 2nd response")
        
    }

) 
```
when you do this only 1st response will be logged and the postman get the this is the 1st respons
why? 
    bcz js is executed line by line and once the response is send by res.send("this is the first response") it does not proceed further 
    
```js
app.get("/user",
    (req,res)=>{
    console.log("1st response");
    },
    (req,res)=>{
        console.log("2nd response");
        res.send("this is the 2nd response")
    }
) 
```
this wont run  as well bcz it there is no response in the 1st handeler and you can not transfer the control to next handeler directly. for this you have to use next() which is passed as a parameter and it transferes the control to next handeler in case 1st handeler does not send any response 




```js
app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");
    res.send("this is the first response")
    next();
    },
    (req,res)=>{
        console.log("2nd handeler");
        res.send("this is the 2nd response")
    }
)
```
If the 1st handeler consist of sending a response it will show an error "Cannot set headers after they are sent to the client" this means that the 1st handeler has already sent a response and cannot send the response again  
Bcz a TCP connection is made btw a client and a server. Postman is the client and once the request is made and the response is sent the connection closes. here we are still trying to send a response even after the connection is lost that's why it shows this error 




```js
app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");
    next();
    res.send("this is the first response")
    },
    (req,res)=>{
        console.log("2nd handeler");
        res.send("this is the 2nd response")   
    }
)
```
this again shows that error "Cannot set headers after they are sent to the client".   
Why?  
 due to the js execution that it executess line by line. On encoutering the next() the control is sent to the 2nd handeler and the response is sent now the next leaves the execution context and the execution comes to line after next() which tries to send the response again 

```js
app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");
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
```
this still shows error bcz when you used next() in tha 4th handeler it was expecting another handeler where you'll send the responsw but it doesn't exist that's why it shows the error "cannot get user"  


You can add handelers just like this or use arrays also and mix both of these methods as well 

```js
app.get("route",rh1,rh2,rh3,rh4)
app.get("route",[rh1,rh2,rh3,rh4])
app.get("route",[rh1,rh2],rh3,rh4)
```
They all give the same response




for simplicity we're calling them route handelers. But now let's be more accurate.  
Route handelers are one that actually handle the route and send the response back, rest are called middelwares
```js
app.get("/user",
    (req,res,next)=>{
    console.log("1st handeler");
    next(); //middleware
    },
    (req,res)=>{
        console.log("2nd handeler");
        res.send("this is the 2nd response")  //route handelers 
    }
)
```
Whenever server gets a request it chains through the middleware to reach the route handelers and send the response back 


Now lets unpack the need of middleware 

```js
app.get("/admin/getAllData",(req,res)=>{
    //this is the logic to authorize the user which you have to write in /deleteAlldata and all the urls. So will you do it one by one by pasting the same logic all over again? NO right? This brings in the need of middleware 
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(isAdminAuthorized){
        res.send("user is authorized")
    }
    else{
        res.status(401).send("user  not authorized ")
    }
})
app.get("/admin/deleteAllData",(req,res)=>{
    //logic to delete data
    res.send("All data dlt")
})
```

this is the most suitable approach->
here the .use runs for all requests starting from /admin and validates the user.
```js
app.use("/admin",(req,res,next)=>{
     //logic to authorize user
    
     const token = "xyz"
     const isAdminAuthorized = token === "xyz"
     if(isAdminAuthorized){
        next()
     }
     else{
        res.status(401).send("user not authorized")
     }
})
app.get("/admin/getAllData",(req,res,next)=>{
    res.send("all data sent")   
})
app.get("/admin/deleteAllData",(req,res)=>{
    //logic to delete data
    res.send("All data dlt")
})
```

you can also move auth code to a different file and import it and then use it like this 
```js
app.use("/admin",adminAuth)
```

or if there is just one request you can do it like this 
```js
app.get("/user",userAuth,(req,res)=>{
    res.send("user data sent")
})
```
the other important part is *handling error*.   
either you can show random errors or gracefully handle them
```js
app.get("/user",userAuth,(req,res)=>{
    //logiv for db calls and other stuff
    throw new Error("asjbdaksdalksdbasl") //suppose this is the error that comes
    res.send("user data sent")
})
```
this error is not gracefully handeled and shows very poor text to handle it gracefully you can  
```js
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
})
```
so what this does is basically for all routes *(bcz we have used .use which check for all route starting with / which are all the routes)* checks if error is there and gracefully handeles them  
>NOTE :- whenever you're using the above error handling always use this at the end of the code 
another approach to gracefully handle error is to use try catch.
```js
app.get("/user",userAuth,(req,res)=>{
    try{
    //logiv for db calls and other stuff
    throw new Error("asjbdaksdalksdbasl")
    res.send("user data sent")
    }
    catch(err){
        res.status(500).send("unable to send data")
    }
})
```
But here the question is both the logics of handling the errors are there but only the 2nd one runs sending "unable to send data" and not the .use one. WHY?   
it happens bcz the the error is throwed is the .get request and is handeled there only no error goes to / request 

>mongodb+srv://kushagradpr:<db_password>@learningnode.jvcpg.mongodb.net/  
    this established a connection with a cluster (which can contain many databases)
mongodb+srv://kushagradpr:<db_password>@learningnode.jvcpg.mongodb.net/HelloWorld   
    this establishes a connection with HelloWorld database


The current issue is the server first starts listening on the port and then the database connection is established.  
But why is this an issue?
It is an issue bcz the server first starts listening requests on the port while the database is not connected. So if the user is sending request it cannot access anything as the database is not connected  
so what one should do is establish a connection with the databse first and then start listening on the port 

```js
//old code 
//databse.js
const connectCLuster = async()=>{
    await mongoose.connect("mongodb+srv://kushagradpr:ipzHZS8FROU1ca7R@learningnode.jvcpg.mongodb.net/") 
}
connectCLuster()
    .then(()=>{console.log("cluster connection established");
    })
    .catch((err)=>{console.log("cluster cannot be connected");
    })

module.exports = connectCLuster

//app.js
const express = require("express")
const {adminAuth,userAuth} = require("./middleware/auth.js")
require("./config/database.js")
const app = express()
app.listen(3000,()=>{
    console.log("server succesffuly listening on port 300"); 
})
```

```js 
//new code 
//databse.js
const connectCLuster = async()=>{
    await mongoose.connect("mongodb+srv://kushagradpr:ipzHZS8FROU1ca7R@learningnode.jvcpg.mongodb.net/") 
}


module.exports = connectCLuster

//app.js
connectCluster()
    .then(()=>
        { //now once the connection to database is establlished only then it starts listening on the port
            console.log("cluster connection established");
            app.listen(3000,()=>{
                console.log("server succesffuly listening on port 300"); 
            })
    })
    .catch((err)=>
        {console.log("cluster cannot be connected");
    })
```
Right now we are hardcoding the data by ourselves but we want the user to enter the data and when we make the post call it gets save to the database 
```js
const user = new User({
        firstName:"asdasd",
        lastName:"asdasd",
        password:12345,
        emailId:"assd@gmail.com"
    }) 
```

>Difference btw **JSON** and **JS object**
JSON is a format of exhchanging data btw sevrer and client whereas js object is a data structure for storing data in key value pair  
In json format both key value pair should be enclosed within "" whereas in js object no need to enclose key in ""  
JSON can easily be converted in JS obejct and vice versa 

```js
console.log(req.body)
// this logs undefined bcz the data we've passed from the post request is in json format and the engine cannot read it. SO we have to first convert it into js object which the engine can read for that we use a middleware provided by the express called express.json()
app.use(express.json())
//since no url is provided this will work for all the routes and the apis converting all json to js object
```

```js
gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid")
            }
        }
    },
``` 
the issue with this validate() is that by default it only works when we add new document to the collection not when we update the data  
so we have to explicitly do 
```js
const userInfo = await User.findByIdAndUpdate({_id:userId},data,
            {returnDocument:"after",
                runValidators:true
            },
```
there are multiple ways to add validation to the data user is sending. 
1. you can either set the validation at schema or database level
2. you can create helper functions which check the user data after entering before going into db 

>The flow for /signup api is 
>  1. you validate the data entered 
>  2. you encrypt the password and then save it 

```js
const user = new User(req.body) 
//this is not a good way to extract body of a request. you should extract the fields you require by naming them 
const user = new User({
        firstName,
        lastName,
        password:passwordHash,
        emailId
    })
```
whenever you encrypt a password using hash function you add 2 parameters, 1st is the password, 2nd is the salt rounds.  
if salt rounds increases the encyption increases but time also increases so best chosen number is 10
```js
await bcrypt.hash(password,10)
```
