const mongoose = require('mongoose');
const Doctor = require('./models/doctor');
const Patient = require('./models/patient');
const url = 'mongodb://localhost:27017/clinicDB';
const express = require('express');
const app = express();
const ejs = require('ejs');

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('css'));
app.use(express.static('img'));
app.listen(8080);

mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    } else {
        console.log('Successfully connected');
    }
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/adddoctor', function (req, res) {
    res.render('adddoctor.html');
});

app.post('/doctoradded', function (req, res) {
    let newDoctor = new Doctor({
        fullName: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        dob: req.body.dob,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        },
        numPatients: req.body.numPatients
    });
    newDoctor.save(function (err) {
        if (err) {
            res.redirect('/invaliddata');
        } else {
            console.log('New doctor successfully added to the DB');
            res.redirect('/listdoctors');
        }
    });
});

app.get('/listdoctors', function (req, res) {
    Doctor.find(function (err, docs) {
        res.render('listdoctors.html', {doctorsdb: docs});
    });
});

app.get('/addpatient', function (req, res) {
    res.render('addpatient.html');
});

app.post('/patientadded', function (req, res) {
    let newPatient = new Patient({
        fullName: req.body.fullName,
        doctor: req.body.doctor,
        age: req.body.age,
        dateOfVisit: req.body.dateOfVisit,
        caseDescription: req.body.caseDescription
    });
    newPatient.save(function(err) {
        if (err) {
            res.redirect('/invaliddata');
        } else {
            Doctor.updateOne({_id: req.body.doctor}, {$inc: {numPatients: 1}}, function (err, data) {
                console.log(data);
            });
            console.log('New patient successfully added to the DB');
            res.redirect('/listpatients');
        }
    });
});

app.get('/listpatients', function (req, res) {
    Patient.find({}).populate('doctor').exec(function (err, docs) {
        console.log(docs);
        res.render('listpatients.html', {patientsdb: docs});
    });
});

app.get('/deletepatient', function (req, res) {
    res.render('deletepatient.html');
});

app.post('/patientdeleted', function (req, res) {
    Patient.deleteOne({fullName: req.body.fullName}, function (err, data) {
        if (err) {
            res.redirect('/invaliddata');
        } else {
            console.log(data);
            res.redirect('/listpatients');
        }
    });
});

app.get('/updatedoctor', function (req, res) {
    res.render('updatedoctor.html');
});

app.post('/doctorupdated', function (req, res) {
    Doctor.updateOne({_id: req.body.id}, {$set: {numPatients: req.body.numPatients}}, function (err, data) {
        if (err) {
            res.redirect('/invaliddata');
        } else {
            console.log(data);
            res.redirect('/listdoctors');
        }
    });
});

app.get('/invaliddata', function (req, res) {
    res.render('invaliddata.html');
});

app.get('/deletedoctor', function (req, res) {
    Doctor.deleteOne({'fullName.firstName': 'Maya'}, function (err, data) {
        console.log(data);
    });
    res.send('Done');
});