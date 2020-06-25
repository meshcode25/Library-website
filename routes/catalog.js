const express= require("express");
const router= express.Router();

let authorcontroller= require("../controllers/authorcontroller");
let bookcontroller= require("../controllers/bookcontroller");
let bookinstancecontroller= require("../controllers/bookinstancecontroller");
let genrecontroller= require("../controllers/genrecontroller");


///Book routes///

//display catalogue home page//
router.get("/", bookcontroller.index)

//get request to create book. note this must come before requests that require book id.//
router.get("/book/create", bookcontroller.book_create_get)

//post request to create book//
router.post("/book/create", bookcontroller.book_create_post);

//get request to display all books//
router.get("/books", bookcontroller.book_list)
//get request for book details//
router.get("/book/:id", bookcontroller.book_details);


//get request to delete a book//
router.get("/book/:id/delete", bookcontroller.book_delete_get);
//post request to delete a book//
router.post("/book/:id/delete", bookcontroller.book_delete_post);

//get request to update a book//
router.get("/book/:id/update", bookcontroller.book_update_get);

//post request to update a book//
router.post("/book/:id/update", bookcontroller.book_update_post);



///Author Routers///

//get request for all authors//
router.get("/authors", authorcontroller.authors_list);

//get request of display create form for a new author//
router.get("/author/create", authorcontroller.author_create_get);

//post request from the author create form//
router.post("/author/create", authorcontroller.author_create_post);

//get request to display one author details//
router.get("/author/:id",authorcontroller.author_details);

//get request to delete an author//
router.get("/author/:id/delete", authorcontroller.author_delete_get);

//post request to delete Author//
router.post("/author/:id/delete", authorcontroller.author_delete_post);

//get request to update author//
router.get("/author/:id/update", authorcontroller.author_update_get);
//post request to update author//
router.post("/author/:id/update", authorcontroller.author_update_post);


 ///Genre Routers/// 

 //get request for all genre//
 router.get("/genres", genrecontroller.genre_list);

 //get request of display create form for a new genre//
 router.get("/genre/create", genrecontroller.genre_create_get);
 //post request from the genre create form//
 router.post("/genre/create", genrecontroller.genre_create_post);
 
 //get request to display one genre details//
 router.get("/genre/:id",genrecontroller.genre_details);
 
 //get request to delete an genre//
 router.get("/genre/:id/delete", genrecontroller.genre_delete_get);
 
 //post request to delete a genre//
 router.post("/genre/:id/delete", genrecontroller.genre_delete_post);
 
 //get request to update genre//
 router.get("/genre/:id/update", genrecontroller.genre_update_get);
 //post request to update genre//
 router.post("/genre/:id/update", genrecontroller.genre_update_post);
 


 ///Bookinstance Routes///
//get request for all bookinstances//
router.get("/bookinstances", bookinstancecontroller.bookinstances_list);

//get request of display create form for a new bookinstance//
router.get("/bookinstance/create", bookinstancecontroller.bookinstance_create_get);

//post request from the genre create form//
router.post("/bookinstance/create", bookinstancecontroller.bookinstance_create_post);
 
 //get request to display one genre details//
 router.get("/bookinstance/:id",bookinstancecontroller.bookinstance_details);
 
 //get request to delete an bookinstance//
 router.get("/bookinstance/:id/delete", bookinstancecontroller.bookinstance_delete_get);
 //post request to delete and bookinstance//
 router.post("/bookinstance/:id/delete", bookinstancecontroller.bookinstance_delete_post); 
 
 
 //get request to update bookinstance//
 router.get("/bookinstance/:id/update", bookinstancecontroller.bookinstance_update_get);
 //post request to update bookinstance//
 router.post("/bookinstance/:id/update", bookinstancecontroller.bookinstance_update_post);
 
module.exports= router;