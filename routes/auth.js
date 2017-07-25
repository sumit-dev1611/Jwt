var jwt = require('jsonwebtoken');

module.exports = {

    verifyAccess: (req, callback) => {
        jwt.verify(req.query.access_token, "abc", function(err, access_token_data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, access_token_data);
            }
        });
    }

}