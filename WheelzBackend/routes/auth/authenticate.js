var jwt = require('jsonwebtoken');
var options = require('../../config/config.js');


let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token == undefined) {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: "No token present, please login first"
            }
        });
    }
    if (token.startsWith('Bearer ')) {
        // Strip token text to just token
        token = token.slice(7, token.length);
    }


    if (token) {
        jwt.verify(token, options.config.secret, (err, decoded) => {
            if (err) {
                let status = 401;

                return res.status(status).json({
                    "status": 401, "error": err, "response": {
                        success: false,
                        message: "Token is not valid"
                    }
                });
            } else {
                req.decoded = decoded;
                //console.log(decoded.exp);

                res.locals.connection.query('SELECT count(`email`) as `accountExists` FROM `Logins` WHERE `email`=?', [req.decoded.username], function (err, results) {
                    if (err) {
                        let status = 401;

                        return res.status(status).json({
                            "status": 401, "error": err, "response": {
                                success: false,
                                message: "Token is not valid"
                            }
                        });
                    } else {
                        if (parseInt(results[0].accountExists) != 1) {
                            return res.status(401).json({
                                "status": 401, "error": err, "response": {
                                    success: false,
                                    message: "Token is not associated with an account"
                                }
                            });
                        } else {
                            res.locals.connection.query('SELECT type FROM `Account` WHERE `email` = ?', [req.decoded.username], function (err, results) {
                                if (err) {
                                    return res.status(500).json({
                                        "status": 500, "error": err, "response": null
                                    });
                                } else {
                                    if (results.length <= 0) {
                                        return res.status(500).json({
                                            "status": 500, "error": err, "response": {message: "Unable to find information about account from token"}
                                        });
                                    }

                                    res.status(200);
                                    return res.json({
                                        "status": 200,
                                        "error": null,
                                        "response": {
                                            "email": decoded.username,
                                            "type": results[0].type,
                                            "exp": decoded.exp,
                                            "iat": decoded.iat,
                                            "dump": Object.keys(decoded)
                                        }
                                    });
                                }
                            });
                            //console.log("decoded = " + decoded.username);

                        }
                        //next();

                    }
                });
            }
        });
    } else {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: 'Auth token not supplied'
            }
        });
    }
};


let authenticateToken = (req, res, next) => {
    // Get the token from any headers
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token == undefined) {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: "No token present, please login first before trying to access this resource"
            }
        });
    }
    if (token.startsWith('Bearer ')) {
        // Strip token text to just token
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, options.config.secret, (err, decoded) => {
            if (err) {
                let status = 401;

                return res.status(status).json({
                    "status": 401, "error": err, "response": {
                        success: false,
                        message: "Token is not valid"
                    }
                });
            } else {
                req.decoded = decoded;

                res.locals.connection.query('SELECT userid, type FROM `Account` WHERE email = ?', req.decoded.username, function (error, results, fields) {
                    if (error) {
                        res.status(500);
                        return res.json({"status": 500, "error": error, "response": null});
                    } else {
                        if (results.length <= 0) {
                            return res.status(400).json({
                                "status": 400,
                                "error": {"message": "Cannot find userid associated with account token"},
                                "response": null
                            });
                        }

                        req.decoded.userid = results[0].userid;
                        req.decoded.type = results[0].type;
                        //console.log("decoded = " + decoded.username + " &userid = " + req.decoded.userid);

                        return next();
                    }
                });


            }
        });
    } else {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: 'Auth token not supplied'
            }
        });
    }
};

let getUserIdFromToken = (req, res, next) => {
    // Get the token from any headers
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token == undefined) {
        return -1;
    }
    if (token.startsWith('Bearer ')) {
        // Strip token text to just token
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, options.config.secret, (err, decoded) => {
            if (err) {
                return -1;
            } else {
                req.decoded = decoded;
                res.locals.connection.query('SELECT userID FROM `Account` WHERE email = ?', req.decoded.username, function (error, results, fields) {
                    if (error) {
                        return -1;
                    } else {
                        if (results.length <= 0) {
                            return -1;//res.status(400).json({"status": 400, "error": {"message":"Cannot find userid associated with account token"}, "response": null});
                        }

                        return results[0].userid;
                    }
                });


            }
        });
    } else {
        return -1;
    }
};

let authenticateTokenAndUserId = (req, res, next) => {
    // Get the token from any headers
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    let userid = req.params.userid || req.body.userid;

    if (token == undefined) {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: "No token present, please login first before trying to access this resource"
            }
        });
    }
    if (userid == undefined) {
        res.status(403);
        return res.json({
            "status": 403, "error": null, "response": {
                success: false,
                message: "No userid present, please ensure you supply the userid correctly"
            }
        });
    }
    if (token.startsWith('Bearer ')) {
        // Strip token text to just token
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, options.config.secret, (err, decoded) => {
            if (err) {
                let status = 401;

                return res.status(status).json({
                    "status": 401, "error": err, "response": {
                        success: false,
                        message: "Token is not valid"
                    }
                });
            } else {
                req.decoded = decoded;

                res.locals.connection.query('SELECT email FROM `Account` WHERE `userid` = ?', [userid], function (error, results, fields) {
                    if (req.decoded.username != results[0].email) {

                        let fuzzed = results[0].email.substring(0, 1) + "*".repeat(results[0].email.length - 4) + results[0].email.substring(results[0].email.length - 3);
                        res.status(403);
                        return res.json({
                            "status": 403,
                            "error": {
                                code: "NOT_AUTHORIZED",
                                message: "You do not have the permissions to view this data.",
                                tokenUser: decoded.username,
                                attemptedToAccessAccount: fuzzed
                            },
                            "response": null
                        });
                    } else {
                        req.decoded.userid = userid;
                        return next();
                    }
                });

            }
        });
    } else {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: 'Auth token not supplied'
            }
        });
    }
};

let authenticateTokenTypeManager = (req, res, next) => {
    // Get the token from any headers
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token == undefined) {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: "No token present, please login first before trying to access this resource"
            }
        });
    }
    if (token.startsWith('Bearer ')) {
        // Strip token text to just token
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, options.config.secret, (err, decoded) => {
            if (err) {
                let status = 401;

                return res.status(status).json({
                    "status": 401, "error": err, "response": {
                        success: false,
                        message: "Token is not valid"
                    }
                });
            } else {
                req.decoded = decoded;

                res.locals.connection.query('SELECT userid, type FROM `Account` WHERE `email` = ?', [decoded.username], function (error, results, fields) {
                    if (error) {
                        return res.status(500).json({"status": 500, "error": error, "response": null});
                    } else {
                        if (results.length <= 0) {
                            res.status(403);
                            return res.json({
                                "status": 403,
                                "error": {
                                    code: "NOT_AUTHORIZED",
                                    message: "The authentication token provided does not correspond to any accounts",
                                    tokenUser: decoded.username
                                },
                                "response": null
                            });
                        }
                        if (results[0].type != "manager") {

                            res.status(403);
                            return res.json({
                                "status": 403,
                                "error": {
                                    code: "NOT_AUTHORIZED",
                                    message: "You do not have the permissions or authorization to view this data.",
                                    tokenUser: decoded.username
                                },
                                "response": null
                            });
                        } else {
                            req.decoded.type = results[0].type;
                            req.decoded.userid = results[0].userid;
                            return next();
                        }
                    }
                });

            }
        });
    } else {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: 'Auth token not supplied'
            }
        });
    }
};

let authenticateTokenTypeOperator = (req, res, next) => {
    // Get the token from any headers
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token == undefined) {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: "No token present, please login first before trying to access this resource"
            }
        });
    }
    if (token.startsWith('Bearer ')) {
        // Strip token text to just token
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, options.config.secret, (err, decoded) => {
            if (err) {
                let status = 401;

                return res.status(status).json({
                    "status": status, "error": err, "response": {
                        success: false,
                        message: "Token is not valid"
                    }
                });
            } else {
                req.decoded = decoded;

                res.locals.connection.query('SELECT userid, type FROM `Account` WHERE `email` = ?', [decoded.username], function (error, results, fields) {
                    if (error) {
                        return res.status(500).json({"status": 500, "error": error, "response": null});
                    } else {
                        if (results.length <= 0) {
                            res.status(403);
                            return res.json({
                                "status": 403,
                                "error": {
                                    code: "NOT_AUTHORIZED",
                                    message: "The authentication token provided does not correspond to any accounts",
                                    tokenUser: decoded.username
                                },
                                "response": null
                            });
                        }
                        if (results[0].type != "operator") {

                            res.status(403);
                            return res.json({
                                "status": 403,
                                "error": {
                                    code: "NOT_AUTHORIZED",
                                    message: "You do not have the permissions or authorization to view this data.",
                                    tokenUser: decoded.username
                                },
                                "response": null
                            });
                        } else {
                            req.decoded.type = results[0].type;
                            req.decoded.userid = results[0].userid;
                            return next();
                        }
                    }
                });

            }
        });
    } else {
        res.status(401);
        return res.json({
            "status": 401, "error": null, "response": {
                success: false,
                message: 'Auth token not supplied'
            }
        });
    }
};

module.exports = {
    authToken: authenticateToken,
    authTokenAndUserId: authenticateTokenAndUserId,
    authTokenManager: authenticateTokenTypeManager,
    authTokenOperator: authenticateTokenTypeOperator,
    getUserIdFromToken: getUserIdFromToken,
    checkToken: checkToken
};