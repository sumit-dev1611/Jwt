var express = require('express');
var router = express();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var validation = require('./validation');
var accessVerification = require('./auth');

router.post('/user/register/', function(req, res, next) {
    validation.validateRegistration(req.body, function(err, data) {
        if (err) {
            next(err);
        } else {
            var detail = new req.users_collection({
                username: data.username,
                email: data.email,
                password: data.password,
                firstname: data.firstname,
                lastname: data.lastname
            })
            detail.save(function(err, data) {
                if (err) {
                    next(err);
                } else {
                    res.json(data)
                }
            })
        }
    })
});


router.post('/user/login/', function(req, res, next) {
    validation.validateLogin(req.body, function(err, data) {
        if (err) {
            next(err);
        } else {
            req.users_collection.findOne({ username: data.username, password: data.password }, function(err, users_data) {
                if (err) {
                    next(err);
                } else if (users_data) {
                    var token = jwt.sign({ user_id: users_data._id }, "abc", {
                        expiresIn: 3600000
                    });
                    res.json(token)
                } else {
                    res.json('Not a user !!!     Get registered')
                }
            });
        }
    });
});

router.get('/user/get', function(req, res, next) {
    accessVerification.verifyAccess(req, function(err, access_token_data) {
        if (err) {
            next(err);
        } else if (access_token_data) {
            if (access_token_data.exp >= parseInt(Date.now() / 1000)) {
                req.address_collection.find({ user_id: access_token_data.user_id }).populate('user_id').exec(function(err, complete_data) {
                    if (err) {
                        next(err);
                    } else if (complete_data) {
                        res.json(complete_data)
                    } else {
                        res.json("can't fetch data")
                    }
                });
            } else {
                res.json("Access token has expired'");
            }
        } else {
            res.json("Incorrect Access Token");;
        }
    });
});



router.all('/user/delete', function(req, res, next) {
    accessVerification.verifyAccess(req, function(err, access_token_data) {
        if (err) {
            next(err);
        } else if (access_token_data) {
            req.users_collection.remove({ "_id": access_token_data.user_id }, function(err, result) {
                if (err) {
                    next(err);
                } else {
                    res.json('data deleted');
                }
            });
        } else {
            res.json("Incorrect Access Token");;
        }
    });
});



router.get('/user/list', function(req, res, next) {
    req.users_collection.find({}).skip((req.query.page) * parseInt(req.query.limit)).limit(parseInt(req.query.limit)).exec(function(err, data) {
        if (err) {
            next(err);
        } else if (data) {
            res.json(data);
        } else {
            res.json("data can't be fetched....ERROR !! ")
        }
    });
});

router.post('/user/address', function(req, res, next) {
    accessVerification.verifyAccess(req, function(err, access_token_data) {
        if (err) {
            next(err);
        } else if (access_token_data) {
            validation.validateAddress(req.body, function(err, data) {
                if (err) {
                    next(err);
                } else if (data) {
                    var userAddress = new req.address_collection({
                        user_id: data.user_id,
                        address: data.address,
                        phone_no: data.phone_no
                    });
                    userAddress.save(function(err, data) {
                        if (err) {
                            next(err);
                        } else {
                            res.json(data)
                        }
                    });
                } else {
                    res.json("data can't be fetched....ERROR !! ");;
                }
            });
        } else {
            res.json("Incorrect Access Token");;
        }
    });
});

module.exports = router;