const express = require('express');

let app = express();
let books = [];

app.get("/", function (req, res) {
    res.send("Welcome to the Bookstore Management System");
});

app.get("/addbook", function (req, res) {
    let newId = Math.round(Math.random() * 1000);
    let newBook = {
        id: newId,
        title: req.query.title,
        author: req.query.author,
        topic: req.query.topic,
        cost: parseInt(req.query.cost),
    };
    books.push(newBook);
    res.send(generateList());
});

app.get("/getallbooks", function (req, res) {
    res.send(generateList());
});

app.get("/deleteid/:idToDelete", function (req, res) {
    deleteBook(parseInt(req.params.idToDelete));
    res.send(generateList());
});

app.get("/getbookstorevalue", function (req, res) {
    res.send("Total bookstore value: $" + calculateTotalValue());
});

app.get("/deletefreebooks", function (req, res) {
    deleteFreeBooks();
    res.send(generateList());
});

app.listen(8080);

function generateList() {
    let st = "ID,   Title,   Author,   Topic,   Cost</br>";
    for (let i = 0; i < books.length; i++) {
        st += books[i].id + " | " + books[i].title + " | " + books[i].author + " | " + books[i].topic + " | " + books[i].cost + "</br>";
    }
    return st;
};

function deleteBook(idToDelete) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === idToDelete) {
            books.splice(i, 1);
        }
    }
}

function deleteFreeBooks() {
    for (let i = 0; i < books.length; i++) {
        if (books[i].cost == 0) {
            books.splice(i, 1);
        }
    }
}

function calculateTotalValue() {
    let totalCost = 0;
    for (let i = 0; i < books.length; i++) {
        totalCost += books[i].cost;
    }
    return totalCost;
}