let jwt = require('jsonwebtoken');

let auth = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    
    if (token) {
        jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
            if (err) {
                return res.json({
                    message: 'Token is invalid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            message: 'Please provide auth token'
        });
    }
};

module.exports = {
    auth: auth
}