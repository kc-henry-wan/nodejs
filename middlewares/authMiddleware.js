const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/jwtConfig');

module.exports = (req, res, next) => {
   
    //testing
    req.userId = 'dummy';
    next();
    
//    const token = req.headers['authorization'];
//    
//    if (!token) return res.status(401).json({ message: 'Unauthorized' });
//
//    jwt.verify(token, secretKey, (err, decoded) => {
//        if (err) return res.status(401).json({ message: 'Unauthorized' });
//
//        req.userId = decoded.id;
//        next();
//    });
};

//function isAuthenticated(req, res, next) {
//  if (!req.user) return res.status(401).send('Unauthorized');
//  next();
//}
//module.exports = isAuthenticated;
