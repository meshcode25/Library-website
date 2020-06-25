var Author= require("../models/author");
var Book= require("../models/book");
var Genre= require("../models/genre");
var Bookinstance= require("../models/bookinstance");

const {check, validationResult}= require("express-validator");
let async =require("async");
const book = require("../models/book");
exports.bookinstances_list=function(req,res,next){
    
    Bookinstance.find().
    populate("book").exec(function(err,results){
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
            res.render("bookinstanceslist", {title: "List of All Available Bookinstances", bookinstances: results})
        }     
    })
}

exports.bookinstance_create_get=function(req,res,next){
    Book.find({}, "title").exec(function(err,results){
        if(err) next(err)
        console.log(results)
        res.render("bookinstanceform", {title:`Create BookInstance`, books: results})
    })
}


exports.bookinstance_create_post=[
    //validate and sanitizethe data from the form
    
    check("book", "The book's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("imprint", "The imprint's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("due_back", "invalid Date").optional({checkFalsy:true}).isISO8601().escape(),
    check("status", "The status's field cannot be left blank").isLength({min:1}).trim().escape(),
    
    //now process the data from the form
    (req,res,next)=>{
        //create a bookinstance object with the sanitized and validated form data
        var bookinstance=new Bookinstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back:req.body.due_back
        })
        //extract errrors from the form request
        var errors= validationResult(req);

        //if there are errors render the form again with sanitiezed and validated data
        if(!(errors.isEmpty())){
            //there are errors now render the form again
            Book.find().exec(function(err,results){
                res.render("bookinstanceform", {title:"Create new Bookinstance", bookinstance:bookinstance, errors:errors.array(),selected_books: bookinstance.due_back.id, books:results})
            
            })
        }
        else{
            //no errors so save to create new bookinstance
            bookinstance.save(function(err,results){
                if(err){
                    return next(err) 
                }
                else{
                    console.log(`A new book instance has been created ${results}`)
                    res.redirect(results.url)
                }
                })
        }



    }

]


exports.bookinstance_details=function(req,res,next){
    async.parallel({
        bookinstance:function(cb){
                Bookinstance.findById(req.params.id).populate("book").exec(cb)
        },
        book: function(cb){
            Book.find({"bookinstance": req.params.id}).exec(cb)
        }
        },function(err,results){
            if(err) {
                return  next(err)
            }
            else{
                
                res.render("bookinstancedetails", {title: "BookInstance Details", bookinstance: results.bookinstance, })
            }
            
    })

}

exports.bookinstance_delete_get=function(req,res,next){
    Bookinstance.findById(req.params.id).populate("book").exec(function(err,results){
        if(err) return next(err)
        res.render("bookinstancedelete", {title:`BookInstance Delete ${results.book.title}` ,bookinstance:results})
    })


}


exports.bookinstance_delete_post= function(req,res,next){
    Bookinstance.findByIdAndRemove(req.params.id).exec(function(err){
        if(err) return next(err)
        res.redirect("/catalog/bookinstances")
    })
}


exports.bookinstance_update_get=function(req,res,next){
    async.parallel({
            bookinstance: function(cb){
                Bookinstance.findById(req.params.id).populate("book").exec(cb)
            },
            books: function(cb){
                Book.find().exec(cb)
            }
        },function(err,results){
            if(err) return next(err)
            res.render("bookinstanceupdate", {title:`BookInstance Update ${results.bookinstance.book.title}`,bookinstance:results.bookinstance, books: results.books, selected:results.bookinstance.book.id})
        })
        
    }

exports.bookinstance_update_post=[
    //validate and sanitizethe data from the form
    
    check("book", "The book's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("imprint", "The imprint's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("due_back", "invalid Date").optional({checkFalsy:true}).isISO8601().escape(),
    check("status", "The status's field cannot be left blank").isLength({min:1}).trim().escape(),
    
    //now process the data from the form
    (req,res,next)=>{
        //create a bookinstance object with the sanitized and validated form data
        var bookinstance=new Bookinstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back:req.body.due_back,
            id:req.params.id
        })
        //extract errrors from the form request
        var errors= validationResult(req);

        //if there are errors render the form again with sanitiezed and validated data
        if(!(errors.isEmpty())){
            //there are errors now render the form again
            async.parallel({
                bookinstance: function(cb){
                    Bookinstance.findById(req.params.id).populate("book").exec(cb)
                },
                books: function(cb){
                    Book.find().exec(cb)
                }
            },function(err,results){
                if(err) return next(err)
                res.render("bookinstanceupdate", {title:`BookInstance Update ${results.bookinstance.book.title}`,bookinstance:bookinstance, books: results.books, selected:bookinstance.book.id})
            })
            
        }
    
        else{
            //no errors so save to create new bookinstance
            Bookinstance.findByIdAndUpdate(req.params.id, {  
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back:req.body.due_back,
                id:req.params.id},function(err,results){
                    if(err) next(err)
                    console.log(`BookInstance has successfully been updated to ${results}`)
                    res.redirect(results.url)
                })

        }



    }
    
]












