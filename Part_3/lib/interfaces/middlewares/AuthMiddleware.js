const { verify } = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not found' });
  }
  try {
    const decodedToken = verify(accessToken, config.JWT_SECRET_KEY);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid access token' });
  }
};

module.exports = authMiddleware;
