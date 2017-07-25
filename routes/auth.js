var jwt = require('jsonwebtoken');

module.exports = {
    verifyAccess: (req, callback) => {
        jwt.verify(req.query.access_token, "abc", function(err, access_token_data) {
            if (err) {
               callback(err,null);
            } else if (access_token_data.exp >= parseInt(Date.now() / 1000)) {
                callback(null,access_token_data);
            }else{
            	callback("Access Token Expired",null);
            }
        });
    }

}