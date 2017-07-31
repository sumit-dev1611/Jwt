var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes/index.js');
var db = require('./mongodb/db.js');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({
    extended: true
}));

passport.use(new Strategy(function(token, cb) {
    jwt.verify(token, "abc", function(err, access_token_data) {
        if (err) {
            return callback(err, null);
        } else {
            db.user.find({ _id: access_token_data.user_id }).exec(function(err, user) {
                if (err) {
                    return cb(err, null);
                } else if (!user) {
                    return cb(null, false);
                } else {
                    return cb(null, user);
                }
            });
        }
    });
}));

app.use('/', routes);
app.use(errorHandler);

function errorHandler(err, req, res, next) {
    if (err) {
        res.status(400).json({ error: err });
    }
}

app.listen(3015, function() {
    console.log("Server started at port number: 3015");
});