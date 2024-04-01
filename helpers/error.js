function errorhandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ err: "the user is not authorized" })
    }
    if (err.name === 'ValidationError') {
        res.status(401).json({ err: "the user is not valid" })
    }
    return res.status(500).json({ msg: err })
}
export default errorhandler