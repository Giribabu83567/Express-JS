const express = require("express")
const app = express();


const {open} = require("sqlite")
const sqlite3 = require("sqlite3")

const path = require("path");
//const { request } = require("http");

const dbPath = path.join(__dirname, "books Data.db")

let db = null;

app.use(express.json())

const initialize_Database_And_Server = async () => {
    try
    {
        db = await open({
            filename : dbPath,  //database path
            driver : sqlite3.Database,  //sqlite database driver
        });
        app.listen(4523, () => {
            console.log("Server Running at 4523 Port");
        });
    }
    catch(e)
    {
        console.log(`Database Error : ${e.message}`)
        process.exit(1);
    }
   
};
initialize_Database_And_Server()

// Create data in database
app.post("/addBook", async (request,response) => {
    const  bookDetails = request.body
    //console.log(bookDetails)

    const {id,
           title,
           authorName,
           rating,
           ratingCount,
           reviewCount,
           description,
           pages,
           dateOfPublish,
           editionLanguage,
           price,
           onlineStores
                    } = bookDetails;
    
    const addBookQuery = `INSERT INTO books(id,title,authorName,rating,ratingCount,reviewCount,description,pages,
                                             dateOfPublish,editionLanguage,price,onlineStores)
                             VALUES(
                                 ${id},
                                 "${title}",
                                 "${authorName}",
                                 ${rating},
                                 ${ratingCount},
                                ${reviewCount},
                             "${description}",
                                ${pages},
                                 "${dateOfPublish}",
                                 "${editionLanguage}",
                                 ${price},
                                "${onlineStores}"
                             );`;
                                              
    //console.log(addBookQuery)
    const dbResponse = await db.run(addBookQuery);
    //const bookId = dbResponse.lastId
    response.send(dbResponse);
})

// Retrive data from database
app.get("/books/:bookId/", async (request, response) =>{
    const {bookId} = request.params;
    //console.log(bookId)
    const getBookQuery = `SELECT * FROM books WHERE id = ${bookId};`;
    const book = await db.get(getBookQuery)
    response.send(book)
})

// Update data in the database
app.put("/update-books/:bookId", async (request,response) =>{
    const {bookId} = request.params
    //console.log(bookId)
    const booksDetails = request.body;
    const {onlineStores} = booksDetails;
    const updateQuery = `UPDATE books SET onlineStores = "${onlineStores}" WHERE id = ${bookId};`;
    
    await db.run(updateQuery)
    response.send("Data is Successfully Updated")
})

// Remove data from database
app.delete("/delete-book/:bookId", async (request,response) =>{
    const {bookId} = request.params
    console.log(bookId)

    const deleteQuery = `DELETE FROM books WHERE id = ${bookId};`;
    await db.run(deleteQuery);
    response.send("Book Deleted Successfully")
})


// Filtering Books from API
app.get("/filter-books/", async(request,response) =>{
    const {search_q} = request.query
    //console.log(search_q)

    const filterQuery = `SELECT * FROM books WHERE title LIKE '%${search_q}%';`;
    //console.log(filterQuery)

    const booksArray = await db.all(filterQuery)
    // console.log(booksArray)
    response.send(booksArray)
})