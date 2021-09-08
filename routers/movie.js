const Actor = require('../models/actor');
const Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {
    // POST: Create a new movie - app.post('/movies', movies.createOne);
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },

    // *POST: Add an actor to a movie's list of actors - app.post('/movies/:mId/actors/:aId', movies.addActor);
    addActor: function (req, res) {
        Movie.findOne({_id: req.params.mId}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({_id: req.params.aId}, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            });
        });
    },

    // GET: Get one movie by ID - app.get('/movies/:id', movies.getOne);
    getOne: function (req, res) {
        Movie.findOne({_id: req.params.id})
            .populate('actors')
            .exec(function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    // *GET: Get all movies - app.get('/movies', movies.getAll);
    getAll: function (req, res) {
        Movie.find({}).populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },

    // *GET: Get all movies between year1 and year2 - app.get('/movies/:year1/:year2', movies.getByYear);
    getByYear: function (req, res) {
        Movie.find({$and: [{year: {$lte: req.params.year1}}, {year: {$gte: req.params.year2}}]}, function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },

    // PUT: Update one movie by ID - app.put('/movies/:id', movies.updateOne);
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({_id: req.params.id}, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    // *PUT: Remove an actor from a movie's list of actors - app.put('/movies/:mId/:aId', movies.removeActor);
    removeActor: function (req, res) {
        Movie.findOneAndUpdate({_id: req.params.mId}, {$pull: {actors: req.params.aId}}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json({
                'Result':'Removed one actor from movies list of actors'
            });
        });
    },

    // *DELETE one movie by ID - app.delete('/movies/:id', movies.deleteOne);
    deleteOne: function (req, res) {
        Movie.deleteOne({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json({
                'Result':'Deleted one movie with given ID'
            });
        });
    },

    // *DELETE all movies between year1 and year 2 - app.delete('/movies', movies.deleteByYear);
    deleteByYear: function (req, res) {
        Movie.deleteMany({$and: [{year: {$lte: req.body.year1}}, {year: {$gte: req.body.year2}}]}, function (err) {
            if (err) return res.status(400).json(err);
            res.json({
                'Result':'Deleted all movies between year 1 and year 2'
            });
        });
    }
};