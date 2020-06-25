var Author= require("../models/author");
var Book= require("../models/book");
var Genre= require("../models/genre");
var Bookinstance= require("../models/bookinstance");

var async= require("async");

const {check, validationResult}=require("express-validator");
const {body}=require("express-validator");


exports.index=function(req,res){
    async.parallel({
        book_count: function(callback){
            Book.countDocuments(callback);
        },
        author_count:function(callback){
            Author.countDocuments(callback);
        },
        available_book_count: function(callback){
            Bookinstance.countDocuments({status:"available"},callback);
        },
        bookinstance_count:function(callback){
            Bookinstance.countDocuments(callback);
        },
        genre_count: function(callback){
            Genre.countDocuments(callback);
        }
    },
    function (err,results) {
        res.render("index",{title:"MESHACK'S LIBRARY", error: err, database_data: results});
    }      
    )
}

/* 
Book create form on get request 
*/ 
exports.book_create_get=function(req, res,next){
    async.parallel({
        authors: function(callback){
            Author.find({}).exec(callback);
        },
        genres: function(callback){
            Genre.find({},callback);
        }
 
    },
        function(err, results){
            if(err){
                return next(err)
            }
            else{
            res.render("bookform", {title:"Book Create Form",authors: results.authors, genres:results.genres, errors: err});
            }
        })
}

exports.book_create_post=[
    //convert genre into an array
            (req,res,next)=>{
            if(!(req.body.genre instanceof Array)){
            if(req.body.genre ===undefined){
                req.body.genre=[];
            }
            else{
                req.body.genre=new Array(req.body.genre);
            }

        }
        next();
    },
   
   //validation and sanitization of fields in the request create form
    check("title", "the title is invalid").isLength({min:1}).trim().escape(),
    check("isbn","the isbn field is invalid").isLength({min:1}).trim().escape(),
    

    


    //process request after validation and sanitization
    (req,res,next)=>{
        
        //collect errors from the request
        const errors=  validationResult(req);
        
        //make an object with sanitized and validated data
        var book=new Book({
            title: req.body.title,
            summary:req.body.summary,
            author:req.body.author,
            isbn: req.body.isbn,
            genre:req.body.genre,
        })
        
    
        //if there are errors return the sanitized and validated results to the create book form
        if(!(errors.isEmpty())){

            async.parallel({
                genres: function(callback){
                    Genre.find().exec(callback)
                },

                authors:function(callback){
                    Author.find().exec(callback)
                }
            },
            function(err,results){
                //render the form again with sanitized and validated results
                //mark the checked genres as checked
                for(var i=0; i<results.genres.length; i++){
                    if(book.genre.indexOf(results.genres[i])>-1){
                        results.genres.checked=true;
                    }
                }
                if(err){
                    next(err);
                }
                res.render("bookform", {title: "Create Book Form", book:book, genres:results.genres, authors: results.authors, errors: errors.array()})
            })
            }
        else{
            book.save(function(err){
                if(err){
                    return (next(err))
                }
            res.redirect(book.url);
            })
        }
    }

    
]

exports.book_list=function (req,res,next){
            
    Book.find({}, "title author")
        .populate("author").exec(function(err,results){
            if(err)return next(err);
            else{
                res.render("book_list", {title: "List of all available books", books: results});
            }
        })
}


exports.book_details=function(req,res, next){

    async.parallel({
        book:function(callback){
            Book.findById(req.params.id)
                .populate("author")
                .populate("genre").exec(callback);
            
        },
        bookinstance: function(callback){
            Bookinstance.find({ "book": req.params.id})
                .exec(callback)
        },
    },function(err, results){
        if(err) return next(err);
        if(results.book===null){
            var err= new Error("Book not found");
            err.status=404;
            return next(err);
        }
        else{
            
            res.render("book_details",{title: "Book Title", book: results.book, bookinstances : results.bookinstance})
        }

    })
}


exports.book_delete_get= function (req,res,next){

    async.parallel({
        book:function(callback){
            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .exec(callback)
        },
        book_instance:function(callback){
            Bookinstance.find({"book":req.params.id}).populate("book").exec(callback)

        }
    },
        function(err,results){
            if(err){next(err)}
            if(results.book==null){
                // no book found
                res.redirect("/catalog/books")
            }
            //there are these book now display the book details and book delete form 
            res.render("book_delete.pug", {title: "Delete Book", book: results.book, bookinstances:results.book_instance})
        })
}


exports.book_delete_post=function(req,res,next){
    
        
    Book.findByIdAndRemove(req.body.id, function deletebook(err){
        if(err){
            next(err)
        }
        else{
                res.redirect("/catalog/books");
            }
        
    })
}

exports.book_update_get= function(req,res,next){
    
    async.parallel({
        book:function(cb){
            Book.findById(req.params.id)
            .populate("genre")
            .populate("author")
            .exec(cb)
        },
        genres:function(cb){
            Genre.find({}).exec(cb)
        },
        authors: function(cb){
            Author.find().exec(cb)
        }
    },function(err,results){
            if(err){
                if(results==null){
                    var err= new Error("Book not found")
                    err.status=404
                    next(err);
                }
                next(err);
            }
            for(let all_genres=0; all_genres<results.genres.length; all_genres++ ){
                for(let book_genre=0; book_genre< results.book.genre.length; book_genre++){
                    if(results.book.genre[book_genre].id.toString()===results.genres[all_genres].id.toString()){
                        results.genres[all_genres].checked="true";
                    }
                }
            }
            
            res.render("bookform", {title: `Update Book: ${results.book.title}`, book:results.book, genres:results.genres, authors: results.authors})
        })  
}
exports.book_update_post=[


    //converst the genres to into an array
    (req,res,next)=>{
        //if genres is not an array
        if(!req.body.genre instanceof Array){
            if(typeof req.body.genre ===undefined){
                req.body.genre=[];
            }else{
                req.body.genre=new Array(req.body.genre);
            }
        }
        next();
    },


    //Validate and sanitize the incoming data from the form to update book
    check("title", "The title's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("isbn", "The Isbn's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("summary", "The summary's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("author", "The author's field cannot be left blank").isLength({min:1}).trim().escape(),
    check("genre", "The Genre's field cannot be left blank").isLength({min:1}).trim().escape(),

    //now process request after sanitization and validation
    (req,res,next)=>{
        
        
        //create an object with sanitize and validated data just like the one craeated when someone submits data from a form
        let book= new Book({
            title: req.body.title,
            author:req.body.author,
            summary:req.body.summary,
            isbn:req.body.isbn,
            genre: req.body.genre,
        });
                
        //extract errors from the request to send to the front end incase of errors
        var errors= validationResult(req);

        //if there are errors render the form again with errors and with the sanitized values and validated ones
        if(!(errors.isEmpty())){
            
            async.parallel({
                authors:function(cb){
                    Author.find().exec(cb);
                },
                genres:function(cb){
                    Genre.find().exec(cb);
                }
            },function(err,results){
                if(err){
                    next(err);
                }
                    //select the selected books
                res.render("bookform", {title:  `Update Book: ${book.title}`, book: book, genres:results.genres, authors: results.authors, errors: errors.array()})
            })
        }
        else{
                         
            Book.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                id: req.params.id,
                author:req.body.author,
                summary:req.body.summary,
                isbn:req.body.isbn,
                genre: req.body.genre,
            },function(err,results){
                if(err) next(err)
                console.log(`This Book has been successfully Updated to ${results.title} `)
                res.redirect(results.url)
            })
        }
    }
    
]
    
        
    


