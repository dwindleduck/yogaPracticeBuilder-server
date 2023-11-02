//ensures the user is logged in and is an ADMIN level user
const requireAdmin = (req, res, next) => {
    if(req.user.permissionLevel !== "admin"){
        return res.status(401).json(`Unauthorized - permission level`);
    }
    next()
}; 


module.exports = {requireAdmin}