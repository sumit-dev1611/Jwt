var jwt = require('jsonwebtoken');

module.exports = {
    verifyAccess: (req, callback) => {
        jwt.verify(req.query.access_token, "abc", function(err, access_token_data) {
            if (err) {
                next(err);
            } else {
                callback(null,access_token_data)
            }
        });
    }

}