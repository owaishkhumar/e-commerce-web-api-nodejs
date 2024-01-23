const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked 
  }).unless({
    path:[
        {url: /\/api\/v1\/products(.*)/ , method: ['GET', 'OPTIONS']},
        {url: /\/api\/v1\/category(.*)/ , method: ['GET', 'OPTIONS']},
        {url: /\/public\/uploads(.*)/ },
        `${api}/user/login`,
        `${api}/user/register`,
        `${api}/user/admin`
    ]
  });
}

var isRevoked = (req, jwt) =>{
    const payload = jwt.payload;
    if(!payload.isAdmin){
        return true;
    }

    return false;
}

module.exports = authJwt;