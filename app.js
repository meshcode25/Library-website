const express=require("express");
const createError=require("http-errors")
const logger= require("morgan");
const cookieParser=require("cookie-parser");
const compression= require("compression");
const helmet= require("helmet");
const path=require("path");

const app=express();

//populate the database//
const populatedb=require("./populatedb");
//const dbs=populatedb();

//import routes
var indexRouter=require("./routes/index")
var catalogRouter=require("./routes/catalog")
var usersRouter=require("./routes/users")
// connect to the database 
const mongoose= require ("mongoose");

const db_url= "mongodb+srv://mesh:mesh@cluster0-gbbbe.mongodb.net/test?retryWrites=true&w=majority"
mongoDB= process.env.mongoDB|| db_url;
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false});


let db=mongoose.connection;
db.on("error", console.error.bind(console, "The mongoDB database error, not able to connect" ))
db.on("connected", ()=>{console.log("MongoDB database has successfully been connected")})

//Middleware
// body parser 
app.use(express.json())
app.use(express.urlencoded({extended:false}));

//views set up 
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
 app.set("view engine", "pug");

 // use of paths as middlewares
app.use("/", indexRouter);
app.use("/users", usersRouter )
app.use("/catalog", catalogRouter);
 // middlwares use
 app.use(cookieParser());
 app.use(compression());
 app.use(helmet());
 app.use(logger("dev"));

 //catch 404 error and foward to error handler
 app.use(function(req, res,next){
   next(createError(404));  
 })
 //error handler 
 app.use((err,req, res, next)=>{
     //set out local to display error only during developent
     res.locals.message= err.message;
     res.locals.error= req.app.get("env")=== "development"? err: {};

     //render the error page
     res.status(err.status|| 500);
    res.render("errors")
 })

 module.exports= app;