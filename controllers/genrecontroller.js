var Author= require("../models/author");
var Book= require("../models/book");
var Genre= require("../models/genre");
var Bookinstance= require("../models/bookinstance");

const async=require("async");

const {check, validationResult}=require("express-validator")


exports.genre_list=function(req,res,next){
    
    Genre.find().exec(function(err,results){
        if(err){
            if(results===null){
                err.status=404;
                err.msg="No Genres found"
            }
            else{
            next(err)
            }
        }
        else{
            res.render("genrelist", {title: "List of All Available Genres", genres: results})
        }     
    })
}

exports.genre_create_get=function(req,res,next){
    res.render("genreform", {title: "Create New Genre Form"})

}

exports.genre_create_post=[
    //first things first is to convert the genre into an array
    (req,res,next)=>{
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ===undefined){
                req.body.genre=[];
            }
            else{
                req.body.genre= new Array(req.body.genre)               
            }
        }
        
        next()
    },

    //Validate and sanitize the data from the genre form
    check("genre").isLength({min:1}).trim().withMessage("Genre name field cannot be left blank").isAlphanumeric()
        .withMessage("Genre field character type is invalid, only accepts alphanumeric characters").escape(),


    //now process the Genre form data after validation and sanitization

    (req,res,next)=>{
        //create a Genre object with the sanitize and validate values
        let genre= new Genre({
            name: req.body.genre
        })
        //extract the errors from the validation and sanitization
        var errors= validationResult(req)
        //now check for any errors in the form validation, if there are errors you render the form again with the sanitize and validated data
        if(!(errors.isEmpty())){
            res.render("genreform", {genre:genre, errors: errors.array()})
        }
        else{
            //There are no error in validation, now save the genre object to create new genre
            
            //first check if there is already a genre with same name
            Genre.findOne({"name":req.body.genre}).exec(function(err,results){
                if(err) next(err)
                
                if(results){
                    //Genre with the same name already exits
                    res.redirect(results.url)
                }
                else{
                    //No genre with this name hence save to create genre
                    
                    genre.save(function(err){
                        if(err) next(err)
                        console.log(`New genre has successfully been created ${genre.name}`);
                        res.redirect(genre.url);
                    })
                }
            })
        }    
    }
]


exports.genre_details=function(req,res,next){
    async.parallel({
        genre:function(cb){
            Genre.findById(req.params.id).exec(cb)
        },
        genrebooks:function(cb){
            Book.find({"genre": req.params.id}).exec(cb)
        }
    },function(err,results){
        if(err)next(err)
        res.render("genredetails",{title:  `Genre Details for ${results.genre.name}`, genre:results.genre, genrebooks:results.genrebooks})       
    })
}

exports.genre_delete_get=function(req,res,next){
    async.parallel({
        genrebooks:function(cb){
            Book.find({"genre": req.params.id}).exec(cb)
        },
        genre:function(cb){
            Genre.findById(req.params.id).exec(cb)
        }
    },function(err,results){
        if(err) next(err)
        console.log(results.genrebooks)
        res.render("genredeleteform", {title:`Delete Genre ${results.genre.name}`, genre:results.genre, genrebooks:results.genrebooks})
    })   
}

exports.genre_delete_post=function(req,res,next){
    Genre.findByIdAndRemove(req.body.genre).exec(function(err){
        if(err) next(err)
        console.log(`Genre has successfully been deleted`)
        res.redirect("/catalog/genres");
    })
}


exports.genre_update_get=function(req,res,next){
    Genre.findById(req.params.id).exec(function(err,results){
        res.render("genreform", {title:`Update Genre: ${results.name}`, genre:results })

    })
}

exports.genre_update_post=[
    //first things first is to convert the genre into an array
    (req,res,next)=>{
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ===undefined){
                req.body.genre=[];
            }
            else{
                req.body.genre= new Array(req.body.genre)               
            }
        }
        
        next()
    },

    //Validate and sanitize the data from the genre form
    check("genre").isLength({min:1}).trim().withMessage("Genre name field cannot be left blank").escape(),


    //now process the Genre form data after validation and sanitization

    (req,res,next)=>{
        //create a Genre object with the sanitize and validate values
        let genre= new Genre({
            id:req.params.id,
            name: req.body.genre
        })
        
        //extract the errors from the validation and sanitization
        var errors= validationResult(req)
        //now check for any errors in the form validation, if there are errors you render the form again with the sanitize and validated data
        if(!(errors.isEmpty())){
            res.render("genreform", {genre:genre, errors: errors.array()})
            return
        }
        else{
            //There are no error in validation, now save the genre object to create new genre
                        
            //first check if there is already a genre with same name
            Genre.findByIdAndUpdate(req.params.id,{id:req.params.id,name:req.body.genre},function(err,results){
                if(err) next(err)
                //Genre with the same name already exits
                console.log(results)
                res.redirect(results.url)
                
            })
        }    
    }
]
