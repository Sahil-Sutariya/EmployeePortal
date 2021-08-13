const express = require('express')

const router = express.Router();

const Status = require('../models/status');

function IsloggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

router.get('/', IsloggedIn, (req, res, next) => {
    Status.find((err, statuses)=>{
        if (err) {
            console.log(err);
        }
        else {
            res.render('statuses/index', {
                title: 'Status Lists',
                dataset: statuses,
                user: req.user
            });
        }
    })
});

router.get('/add', IsloggedIn, (req, res, next) => {
    res.render('statuses/add', { title: 'Add a new Status', user: req.user});
});

router.post('/add', IsloggedIn, (req, res, next) => {
    Status.create({
        status: req.body.status
    }, (err, newStatus) => {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect('/statuses')
        }
    });
});

module.exports = router;