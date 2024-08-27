const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            res.locals.user = decoded; 
            next();
        } catch (error) {
            res.redirect('/login');
        }
    } else {
        res.locals.user = null; 
        next();
    }
};


module.exports = ensureAuthenticated;
