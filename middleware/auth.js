const HTTPError = require('../models/http-error');
const jwt=require('jsonwebtoken');

module.exports=(req, res, next)=>{
  let token;
  try{
    token=req.headers.authorization.split(' ')[1];
    if(! token){
      throw new Error('RANDOM');
    }
    const decodedToken=jwt.verify(token, process.env.JWT_KEY);
    req.userData={userId: decodedToken.userId};
    next();
  }catch(e){
    return next(new HTTPError('Authentication Failed', 401));
  }
};