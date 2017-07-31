var db = require('../mongodb/db.js');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');

passport.use(new Strategy(function(token, cb) {
    jwt.verify(token, "abc", function(err, access_token_data) {
        if (err) {
            return cb(err, null);
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