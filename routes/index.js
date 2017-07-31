var express = require('express');
var app = express();
var router = express();
var md5 = require('md5');
var _ = require("lodash");
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var validation = require('./validation');
var passport = require('passport');
var passportJWT = require("passport-jwt");
var model = require('../mongodb/db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

router.post('/user/register/', function(req, res, next) {
    validation.validateRegistration(req.body, function(err, data) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            var detail = new model.user({
                username: data.username,
                email: data.email,
                password: data.password,
                firstname: data.firstname,
                lastname: data.lastname
            })
            detail.save(function(err, data) {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    res.json({ user_detail: data })
                }
            })
        }
    })
});

router.post('/user/login/', function(req, res, next) {
    validation.validateLogin(req.body, function(err, data) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            model.user.findOne({ username: data.username, password: data.password }, function(err, users_data) {
                if (err) {
                    res.status(400).json({ error: err });
                } else if (users_data) {
                    var payload = { user_id: users_data._id };
                    var token = jwt.sign(payload, "abc", {
                        expiresIn: 3600000
                    });
                    res.json({ message: "ok", "Access token": token });
                } else {
                    res.status(400).json({ error: 'Not a user !!!     Get registered' });
                }
            });
        }
    });
});

router.get('/user/get', passport.authenticate('bearer', { session: false }), function(req, res) {
    model.address.find({ user_id: req.user[0]._id }).populate('user_id').exec(function(err, complete_data) {
        if (err) {
            next(err);
        } else if (complete_data) {
            res.json({ user_detail: complete_data })
        } else {
            next("can't fetch data");
        }
    });
});

router.all('/user/delete', passport.authenticate('bearer', { session: false }), function(req, res, next) {
    model.user.remove({ "_id": req.user[0]._id }, function(err, result) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.json({ success: "success" });
        }
    });
});

router.get('/user/list', passport.authenticate('bearer', { session: false }), function(req, res, next) {
    model.user.find({}).skip((req.query.page) * parseInt(req.query.limit)).limit(parseInt(req.query.limit)).exec(function(err, data) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.json({ list: data });
        }
    });
});

router.post('/user/address', passport.authenticate('bearer', { session: false }), function(req, res, next) {
    validation.validateAddress(req.body, function(err, data) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            var userAddress = new model.address({
                user_id: data.user_id,
                address: data.address,
                phone_no: data.phone_no
            });
            userAddress.save(function(err, data) {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    res.json({ address: data })
                }
            });
        }
    });
});

module.exports = router;