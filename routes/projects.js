// Importing express and creatinf router object
// use the router object to associate a Path with Middleware (function)

const express = require('express');
const router = express.Router();

const Project = require('../models/project');
const Status = require('../models/status');

function IsloggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

router.get('/', IsloggedIn, (req, res, next) => {
    //res.render('projects/index', {title : 'Employee Portal'})
    Project.find((err, projects) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('projects/index', {
                title: 'Lists of Employees',
                dataset: projects,
                user: req.user
            });
        }
    });
});

router.get('/add', IsloggedIn, (req, res, next) => {
    /* res.render('projects/add', {title : 'Add a new Employee'}); */
   Status.find((err, statuses) => {
    if (err) {
        console.log(err);
    }
    else {
        res.render('projects/add', {
            title : 'Add a new Employee',
            statuses: statuses, 
            user: req.user
        });
    }
   }).sort({ status: 1 }); 
});



router.post('/add', IsloggedIn, (req, res, next) => {
   Project.create(
    {
    employeeId : req.body.employeeId,
    employeeName : req.body.employeeName,
    date : req.body.date,
    status: req.body.status
   },
    (err, newProject) => {
    if (err) {
        console.log(err);
    }
    else {
        res.redirect('/projects');
    }
   }
   );
});

router.get('/delete/:_id', IsloggedIn, (req, res, next) => {
    Project.remove(
        { 
            _id: req.params._id 
        }, 
        (err) => {
            if(err) {
                console.log(err);
            }
            else {
                res.redirect('/projects')
            }
    });
});

router.get('/edit/:_id', IsloggedIn, (req, res, next) => {
   /* res.render('projects/edit', {title: 'Update employee details'}) */
   Project.findById(req.params._id, (err, project) => {
    if(err) {
        console.log(err);
    }
    else {
        Status.find((err, statuses) => {
            if(err) {
                console.log(err);
            }
            else {
                res.render('projects/edit', {
                    title: 'Update a Employee Details',
                    project: project,
                    statuses: statuses,
                    user: req.user
                })
            }
        }).sort({ status : 1 })
    }
   });
});

router.post('/edit/:_id', IsloggedIn, (req, res, next) => {
    Project.findOneAndUpdate(
        {
            _id: req.params._id
        },
        {
            employeeId : req.body.employeeId,
            employeeName : req.body.employeeName,
            date : req.body.date,
            status: req.body.status
        },
        (err, updateProject) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/projects');
            }
        }
    )
});

module.exports = router;