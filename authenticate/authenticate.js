const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

// Generate a random string (256 bits / 32 bytes)
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log('Generated Secret Key:', secretKey);

const secretKey = 'dakshyaAppForNepal'; 

function authenticateToken(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
     
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
