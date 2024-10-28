sessionCheckfunction sessionCheck(req, res, next) {
    if (req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authenticated, respond with an error
        res.status(401).json({ message: 'Unauthorized: No active session' });
    }
}

module.exports = sessionCheck;
