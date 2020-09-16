// isAuthenticated module
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        // If the user is logged in, continue
        if(req.isAuthenticated()) {
            return next();
        }
        // Else redirect to the root
        res.redirect('/')
    }
}