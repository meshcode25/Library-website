var Author= require("../models/author");
var Book= require("../models/book");
var Genre= require("../models/genre");
var Bookinstance= require("../models/bookinstance");

const async=require( "async");
const {check, validationResult } = require("express-validator");
let moment=require("moment");

//display list of all authors
exports.authors_list=function(req,res,next){    
    
    Author.find({}).exec(function(err,results){
        if(err){
         return  next(err)
        }else{
            
            res.render("author_list",{title: "List of All Authors", authors: results})
        }
    })
}

//Display each author's details
exports.author_details=function(req,res,next){
    async.parallel({
        author: function(cb){
            Author.findById(req.params.id).exec(cb)
        },
        books: function(cb){
            Book.find({}).exec(cb)
        },
        bookinstances:function(cb){
            Bookinstance.find({}).exec(cb)
        }
    },function(err,results){
        if(err) next(err)
    
        res.render("author_details", {title: "Author Details: ", author:results.author})
    })
}

//display form to create a author
exports.author_create_get=function(req,res,next){
    
    res.render("authorform",{title: "Author Create Form"})
}

//create author by post route
exports.author_create_post=[
    //First thing is to validate and sanitize the firlds in the Author create form

    check("firstname").isLength({min:1}).trim().withMessage("The firstname field cannot be left blank")
        .isAlphanumeric(). withMessage("Author firstname must only contain alpanumeric characters").escape(),
    check("familyname").isLength({min:1}).trim().withMessage("The familyname field cannot be left blank")
        .isAlphanumeric().withMessage("Author familyname must only contain alpanumeric characters").escape(),
    check("dateofbirth", "Invalid date of birth").optional({checkfalsy: true}).isISO8601(),
    check("dateofdeath", "Invalid date of death").optional({checkFalsy: true}).isISO8601(),

    //Now process the request after validation and sanitization
    // convert the first and family naem to author name
    function(req,res, next){
        //extract the errors from the form request 
        var errors= validationResult(req);

        //create an Author object with sanitized and validated fields just like the form object data
        var author= new Author({
            first_name: req.body.firstname,
            family_name: req.body.familyname,
            date_of_birth:moment(req.body.dateofbirth).format("MM/DD/YYYY"),
            date_of_death: moment(req.body.dateofdeath).format("MM/DD/YYYY"),
        })
        
        //incase of errors during validation render the form again with validated and sanitized data
        //There are errors with the form render again
        if(!(errors.isEmpty())){
            res.render("authorform", {author:author, errors: errors.array()})
        }
        else{
            //The  forms data is valid now save the data to create new Author
            author.save(function(err){
                if(err){
                    return next(err)
                }else{
                    console.log(`new Author has just been created ${author}` );
                    res.redirect(author.url)
                }
                
            })
        }
    }
]

 //Display the delete page if there are any bookinstances and other books
exports.author_delete_get=function(req,res,next){
    async.parallel({
        author: function(cb){
            Author.findById(req.params.id).exec(cb)
        },
        books: function(cb){
            Book.find({"author": req.params.id}).exec(cb)
        },
        bookinstances:function(cb){
            Bookinstance.find({}).exec(cb)
        }
    },function(err,results){
        if(err) next(err)
        
        res.render("author_delete", {title:`Delete Author: ${results.author.first_name}, ${results.author.family_name}`, author:results.author, books:results.books, bookinstances:results.bookinstances})
    })
}

exports.author_delete_post=function(req,res,next){
    Author.findByIdAndRemove(req.body.id).exec(function(err){
        if(err) next(err);
        res.redirect("/catalog/authors")
    })
}

exports.author_update_get=function(req,res,next){
    Author.findById(req.params.id).exec(function(err,results){
        

        res.render("authorform", {title:`Update Author ${results.first_name}, ${results.family_name}`,  author: results, errors: err, })
    })    
}

exports.author_update_post=[
    //first and foremost you have to validate and sanitize the form fields
    check("firstname").isLength({min:1}).trim().withMessage("Author First Name Field must be filled").isAlphanumeric()
        .withMessage("Characters for the Author name must only be Alphanumeric").escape(),
    check("familyname").isLength({min:1}).trim().withMessage("Author Family Name Field must be filled").isAlphanumeric()
        .withMessage("Characters for the Author name must only be Alphanumeric").escape(),
    check("dateofbirth").optional({checkFalsy:true}).isISO8601().withMessage("Invalid date").escape(),
    check("dateofdeath, invalid Date of Death").optional({checkFalsy:true}).isISO8601().escape(),
    

    //NOw process the sanitized and validated data 
    (req,res,next)=>{
        //extacts errors from the request 
        var errors= validationResult(req);

        //Create an Author Object with the saniteze and validate values
        var author= new Author({
            first_name: req.body.firstname,
            family_name: req.body.familyname,
            date_of_birth: req.body.dateofbirth,
            date_of_death: req.body.dateofdeath,
            id:req.params.id,
        })

        //if there are errors in the form noted during validation and sanitization render the form again with errors
        if(!(errors.isEmpty())){
            res.render("authorform", {author:author, errors: errors.array()})
        }
        // no errors so save the author in order to update the Author
        else{
            Author.findByIdAndUpdate(req.params.id,{
                first_name: req.body.firstname,
                family_name: req.body.familyname,
                date_of_birth: req.body.dateofbirth,
                date_of_death: req.body.dateofdeath,
                id:req.params.id,},function(err,results){
                
                if(err) next(err)
                console.log(`The Author has been successfully updated to ${author}`);
                res.redirect(results.url);
            })
            
        }
    }

]
    