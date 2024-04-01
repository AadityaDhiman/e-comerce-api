import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config()


function AccessToken(req, res, next) {
  if (!req.headers['authorization']) return res.status(401).json("Invalid authorization header");
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ',)
  // const token = bearerToken[1];
  if (bearerToken.length !== 2) {
    return res.status(401).send("Invalid token ");
  }
  const token = bearerToken[1].replace(/"/g, '');
  // console.log( token);
  jwt.verify(token, process.env.secret, (err, payload) => {

    if (err) {
      return next('some error occurred for validation or expiration')
    }
    req.payload = payload
    next()
  })
}

export default AccessToken;




