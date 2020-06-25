function populatedb() {

var Book= require("./models/book");
var Author= require("./models/author");
var Bookinstance= require("./models/bookinstance");
var Genre= require("./models/genre");


const async= require("async");
const mongoose=require("mongoose");

var mongodb_url="mongodb+srv://mesh:mesh@cluster0-gbbbe.mongodb.net/test?retryWrites=true&w=majority";
mongoDB= process.env.mongoDB || mongodb_url;

mongoose.connect(mongoDB, {useUnifiedTopology:true,useNewUrlParser:true});

var db= mongoose.connection;

var authors=[];
var books=[];
var bookinstances=[];
var genres=[];


db.on("connected", ()=>{console.log("PopulatedDB database has been successfully connected")});
db.on("error", console.error.bind(console, "populatedDB ERROR! it could not connect to remote Database"));

 function createauthor(first_name,family_name,date_of_birth,date_of_death,cb){
        var authordetails={first_name:first_name,family_name:family_name,date_of_birth};
        if(date_of_death!==false){
            authordetails.date_of_death=date_of_death;
        }
        var author= new Author(authordetails);
        author.save(function (err){
            if(err){
                cb(err,null);
                return
            }
            console.log("New author"+ author);
            authors.push(author);
            cb(null, author);
        })

 }


 function createbook(title, summary,isbn,author,genre,cb){
        var bookdetails= {title:title, summary:summary, isbn:isbn, author:author, genre:genre};
    
    var book= new Book(bookdetails);
    book.save(function(err){
        if(err){
            cb(err, null)
            return
        }
        console.log("New book"+ book);
        books.push(book);
        cb(null, book);
    })
 }


 function creategenre(name,cb){
        var genredetails={name:name}

        var genre=new Genre(genredetails);
        genre.save(function(err){
            if(err){
            cb(err,null)
            return
            }
            console.log("New genre"+ genre);
            genres.push(genre);
            cb(null, genre);
        })
 }

 function createbookinstance(book,imprint,status,due_back,cb){
        var bookinstancedetails= {book:book, imprint:imprint};
    if(status!==false){bookinstancedetails.status=status};
    if(due_back!==false){bookinstancedetails.due_back=due_back}

    var bookinstance=new Bookinstance(bookinstancedetails);
    bookinstance.save(function(err){
        if(err){
            cb(err,null)
            return
        }
        console.log("New bookinstance"+ bookinstance);
        bookinstances.push(bookinstance);
        cb(null, bookinstance);
    })
 }


 function createbooks(cb){
    async.parallel([
        function(callback){
            createbook("How to talk to anyone-93 little tricks", "the book is about good communication skill to apply to our daily life communication to achieve rich relationships in our lives", "xxxyyy9834", authors[0], [genres[0]],callback);
        },
        function(callback){
            createbook("The Power of now", "This is a spiritual book, which guides us on finding and living a fullfilled spiritual life, it gives tactics to anable one to discover own own spirits thought living in the present moment", "xx9yy834", authors[1], [genres[1]],callback);
        
        },
        function(callback){
            createbook("Unscripted", "Life is about creating your own reality, but at the core of it finding financina freedom so that you can buy freedom of your time. This books guieds it's readers on ways of achieving financial freedom", "xx8934", authors[2], [genres[2]],callback);
        },
        function(callback){
            createbook("Originality", "In the intellectul world the world has had numerous great souls who have been credited for investions that have tranformed the way humans live in this world, this is credited to formulations of new original ideas and thoughts", "xx985yo", authors[3], [genres[3]],callback);
        },
        function(callback){
            createbook("Neuromarketing", "This is a marketing book that show the real sublimalal reasons why we buy whatever we buy, based on neurological studies that determines our congnitive reasons for purchases", "xx975yy", authors[4], [genres[4]],callback);
        },
        function(callback){
            createbook("Millionare Mindset", "This book is primarily based on thinking big and mastering our own beliefs, biases and facts", "x898yy", authors[5], [genres[5]],callback);
        },
        function(callback){
            createbook("Entreprenural Myth", "This is a wonderful book that illustrated the best working stucture and habits to ensure successful creating and running of franchise organizations", "xx989yy", authors[6], [genres[6]],callback);
        },function(callback){
            createbook("Maximum Willpower", "This is a powerful book on the sciece of mastering self control, it defines, explains and gives on methods of leverageging on the power of willpower", "xxyej784", authors[7], [genres[5]],callback)
        }
        
    ],
    //optional call back
    cb
    )
    
 }

function createbookinstances(cb){
    async.parallel([
        function(callback){
            createbookinstance(books[0], "New York imprint illinois,2004", "maintainance", false,callback)
        },
        function(callback){
            createbookinstance(books[0], "New York imprint illinois,2004", "available", false,callback)
        },
        function(callback){
            createbookinstance(books[0], "New York imprint illinois,2004", "available", false,callback)
        },
        function(callback){
            createbookinstance(books[1], "New York imprint illinois,2009", "maintainance", false,callback)
        },
        function(callback){
            createbookinstance(books[1], "New York imprint illinois,2009", "available", false,callback)
        },
        function(callback){
            createbookinstance(books[1], "New York imprint illinois,2009", "loaned", false,callback)
        },
        function(callback){
            createbookinstance(books[2], "New York imprint illinois,2010", "loaned", false,callback)
        },
        function(callback){
            createbookinstance(books[2], "New York imprint illinois,2010", "maintainance", false,callback)
        },
        function(callback){
            createbookinstance(books[3], "New York imprint illinois,2013", "available", false,callback)
        },
        function(callback){
            createbookinstance(books[3], "New York imprint illinois,2013", "maintainance", false,callback)
        },
        function(callback){
            createbookinstance(books[4], "New York imprint illinois", "maintainance", false,callback)
        },
        function(callback){
            createbookinstance(books[5], "New York imprint illinois,2014", "maintainance", false,callback)
        },
        function(callback){
            createbookinstance(books[5], "New York imprint illinois,2014", "available", false,callback)
        },
        function(callback){
            createbookinstance(books[5], "New York imprint illinois,2014", "available", false,callback)
        },
        function(callback){
            createbookinstance(books[6], "New York imprint illinois,2018", "available", false,callback)
        },
        function(callback){
            createbookinstance(books[6], "New York imprint illinois,2018", "maintainance", false,callback)
        },
        function(callback){
            createbookinstance(books[6], "New York imprint illinois,2018", "loaned", false,callback)
        },
    ],
    //optional callback
    cb
    )
}


function creategenres(cb){
    async.parallel([
        function(callback){
            creategenre("Self Development",callback)
        },
        function(callback){
            creategenre("Sprituality",callback)
        },
        function(callback){
            creategenre("Entreprenuership",callback)
        },
        function(callback){
            creategenre("History",callback)
        },
        function(callback){
            creategenre("Marketing",callback)
        },
        function(callback){
            creategenre("Finance",callback)
        },
        function(callback){
            creategenre("Humor",callback)
        },
        function(callback){
            creategenre("Philosophy",callback)
        },
    ],
    //optional callback
    cb
    )
}

function createauthors(cb){
    async.parallel([
        function(callback){
            createauthor("Leil", "Lawndes", "1960",false, callback);
        },
        function(callback){
            createauthor("Eckhart", "Tolle", "1960","2050", callback);
        },
        function(callback){
            createauthor("MJ", "Demarco", "1970",false, callback);
        },
        function(callback){
            createauthor("Sharper", "Knowlson", "1960","1970", callback);
        },
        function(callback){
            createauthor("Martin", "Linstrom", "1960",false, callback);
        },
        function(callback){
            createauthor("Kelvin", "Johnson", "1980",false, callback);
        },
        function(callback){
            createauthor("Martin", "Garber", "1930",false, callback);
        },
        function(callback){
            createauthor("Kelly", "McGonigal", "1960",false, callback);
        },
    ],
        //optiona callback
        cb
        )
}


async.series([
    createauthors,
    creategenres,
    createbooks,
    createbookinstances
],
    
//optional call back function
function(err,result){
    if(err){
        console.log("There was"+ err+ "in populating the datebase")
    }
    else{
        console.log("The remote MonogoDB database has successfully been populated");
    }

//disconnect from database becasause it has already been poplulated
mongoose.connection.close();
 
}
    
)


}


module.exports=populatedb;













