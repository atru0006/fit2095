const express = require('express');
const ejs = require('ejs');
const mongodb = require('mongodb');

const app = express();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('css'));
app.listen(8080);

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';
let db;

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err   ' + err);
    } else {
        console.log('Successfully connected to the server');
        db = client.db('booksdb');
    }
});

app.get('/addbooks', function (req, res) {
    res.render('addbooks.html');
});

app.post('/postadd', function (req, res) {
    db.collection('bookdetails').insertOne({
        title: req.body.title,
        author: req.body.author,
        topic: req.body.topic,
        publicationdate: new Date(req.body.publicationdate),
        summary: req.body.summary
    });
    res.redirect('/listbooks');
});

app.get('/listbooks', function (req, res) {
    db.collection('bookdetails').find({}).toArray(function (err, data) {
        res.render('listbooks.html', {booksdb: data});
    });
});

app.get('/deletebytopic', function (req, res) {
    res.render('deletebytopic.html');
});

app.post('/postdeletetopic', function (req, res) {
    db.collection('bookdetails').deleteMany({topic: req.body.topic}, function (err, obj) {
        console.log(obj.result);
    });
    res.redirect('/listbooks');
});

app.get('/updatebooks', function (req, res) {
    res.render('updatebooks.html');
});

app.post('/postupdate', function (req, res) {
    let filter = {title: req.body.oldtitle};
    let theUpdate = {$set: {
        title: req.body.newtitle,
        author: req.body.author,
        topic: req.body.topic,
        publicationdate: new Date(req.body.publicationdate),
        summary: req.body.summary
    }};
    db.collection('bookdetails').updateOne(filter, theUpdate);
    res.redirect('/listbooks');
});

app.get('/deletebydate', function (req, res) {
    res.render('deletebydate.html');
});

app.post('/postdeletedate', function (req, res) {
    db.collection('bookdetails').deleteMany({$and: [{publicationdate: {$gte: new Date(req.body.startdate)}}, {publicationdate: {$lte: new Date(req.body.enddate)}}]}, function (err, obj) {
        console.log(obj.result);
    });
    res.redirect('/listbooks');
});