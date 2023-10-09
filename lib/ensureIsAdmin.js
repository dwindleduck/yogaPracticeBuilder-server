const ensureIsAdmin = (req, res, next) => {
  
  //not working yet, req.user undefined
  
  if (!req.user || !req.user.permissionLevel==="admin") return res.status(401).json(`Unauthorized - permission level -- ${req}`);
    next();
  }; 

  module.exports = {
    ensureIsAdmin
  }