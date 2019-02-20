const expressjwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwks = require('jwks-rsa');
require('dotenv').config();

// const jwtCheck = expressjwt({
//   secret: process.env.AUTH0_CLIENT_SECRET,
//   audience: 'https://team-refreshr.auth0.com/api/v2/',
//   issuer: 'https://team-refreshr.auth0.com/',
//   algorithms: ['RS256']
// });

const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://team-refreshr.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://team-refreshr.auth0.com/api/v2/',
  issuer: 'https://team-refreshr.auth0.com/',
  algorithms: ['RS256']
});

module.exports = jwtCheck;
