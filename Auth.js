const { UnAuthorized, JWT_SCARATE, INTERNAL_SERVER_ERROR } = require("./Constents")
const jwt = require("jsonwebtoken")

function Auth(req, res, next) {
    try {
        const token = req.headers["token"]
        if (!token) return res.status(401).send({ message: UnAuthorized })
        const result  =jwt.verify(token, JWT_SCARATE)
        req.body.userInfo = result
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: UnAuthorized })
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ message: UnAuthorized })
        }
        return res.status(500).send({ message: INTERNAL_SERVER_ERROR })
    }
}

module.exports = Auth