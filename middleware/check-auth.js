const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("token in authorize : ", token);
        // const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, "secretKey");
        req.userData = decode;
        console.log("req.userData in authorize : ", req.userData);
        next();

    } catch(err) {
        console.log("err in authencation : ", err);
        return res.status(401).json({
            msg : "Authencation failed!!!!"
        });
    }
}

module.exports = authorize;