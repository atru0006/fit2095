const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');

module.exports = {
	// POST: Create one new actor - app.post('/actors', actors.createOne);
    createOne: function (req, res) {
	    let newActorDetails = req.body;
	    newActorDetails._id = new mongoose.Types.ObjectId();
	    Actor.create(newActorDetails, function (err, actor) {
	        if (err) return res.json(err);
	        res.json(actor);
	    });
	},

    // POST: Add a movie to an actor's list of movies - app.post('/actors/:id/movies', actors.addMovie);
    addMovie: function (req, res) {
        Actor.findOne({_id: req.params.id}, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({_id: req.body.id}, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            });
        });
	},

    // GET: Get one actor by ID - app.get('/actors/:id', actors.getOne);
	getOne: function (req, res) {
        Actor.findOne({_id: req.params.id})
        .populate('movies')
        .exec(function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
	},

    // *GET: Get all actors - app.get('/actors', actors.getAll);
    getAll: function (req, res) {
        Actor.find({}).populate('movies').exec(function (err, actors) {
            if (err) return res.status(400).json(err);
            res.json(actors);
        });
	},

    // PUT: Update one actor by ID - app.put('/actors/:id', actors.updateOne);
	updateOne: function (req, res) {
        Actor.findOneAndUpdate({_id: req.params.id}, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
	},

    // *PUT: Remove a movie from an actor's list of movies - app.put('/actors/:aId/:mId', actors.removeMovie);
    removeMovie: function (req, res) {
        Actor.findOneAndUpdate({_id: req.params.aId}, {$pull: {movies: req.params.mId}}, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json({
                'Result':'Removed one movie from actors list of movies'
            });
        });
    },

    // DELETE: Delete one actor by ID - app.delete('/actors/:id', actors.deleteOne);
	deleteOne: function (req, res) {
        Actor.findOneAndRemove({_id: req.params.id}, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
	},

    // *DELETE: Delete one actor and all their movies - app.delete('/actors/:id/movies', actors.deleteActorMovies);
    deleteActorMovies: function (req, res) {
        Actor.findOneAndRemove({_id: req.params.id}, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.deleteMany({_id: actor.movies}, function (err) {
                res.json({
                    'Result':'Deleted one actor and all movies'
                });
            });
        });
    }
};