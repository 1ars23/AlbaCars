const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  databaseDialect: process.env.DATABASE_DIALECT,
  databaseUri: process.env.DATABASE_URI,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
