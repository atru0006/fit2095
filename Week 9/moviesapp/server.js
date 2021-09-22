const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const actors = require('./routers/actor');
const movies = require('./routers/movie');
const app = express();
app.listen(8080);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "dist/moviesapp")));

mongoose.connect('mongodb://localhost:27017/movies', function (err) {
  if (err) {
    return console.log('Mongoose - connection error:', err);
  }
  console.log('Connected successfully');
});

// Actor RESTFul endpoints
app.post('/actors', actors.createOne);
app.post('/actors/:id/movies', actors.addMovie);

app.get('/actors/:id', actors.getOne);
app.get('/actors', actors.getAll);

app.put('/actors/:id', actors.updateOne);
app.put('/actors/:aId/:mId', actors.removeMovie);

app.delete('/actors/:bYear', actors.deleteByBYear);

// Movie RESTFul endpoints
app.post('/movies', movies.createOne);
app.post('/movies/:mId/actors/:aId', movies.addActor);

app.get('/movies/:id', movies.getOne);
app.get('/movies', movies.getAll);
app.get('/movies/:year1/:year2', movies.getByYear);

app.put('/movies/:id', movies.updateOne);
app.put('/movies/:mId/:aId', movies.removeActor);
app.put('/movies/', movies.incrementYear);

app.delete('/movies/:title', movies.deleteOne);
app.delete('/movies/:year1/:year2', movies.deleteByYear);