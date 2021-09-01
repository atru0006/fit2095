const express = require('express');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('img'));
app.use(express.static('css'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

let books = [];

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/listbooks', function (req, res) {
    res.render('listbooks.html', {booksdb: books});
});

app.get('/listtitles', function (req, res) {
    res.render('listtitles.html', {booksdb: books});
});

app.get('/addbooks', function (req, res) {
    res.render('addbooks.html');
});

app.post('/newbookadded', function (req, res) {
    if (req.body.title.length < 3) {
        res.render('invaliddata.html');
    } else if (req.body.author.length < 3) {
        res.render('invaliddata.html');
    } else if (req.body.topic.length < 3) {
        res.render('invaliddata.html');
    } else if (req.body.cost < 0) {
        res.render('invaliddata.html');
    } else {
        let newBook = {
            title: req.body.title,
            author: req.body.author,
            topic: req.body.topic,
            cost: req.body.cost
        }
        books.push(newBook);
        res.render('listbooks.html', {booksdb: books});
    }
});

app.get('*', function (req, res) {
    res.render('pagenotfound.html');
});

app.listen(8080);