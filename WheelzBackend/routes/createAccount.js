const argon2 = require('argon2');
let jwt = require('jsonwebtoken');
var options = require('../config/config.js');


//Handler for user registration

registerUser = async function(req,res) {
    // console.log("req",req.body);
    //var today = new Date();

    if (req.body.type == null || req.body.type == "") {
        res.status(500).json({"status": 500, "error": {"message":"field 'type' is not valid"}, "response":null});
    }
    if (req.body.fname == null || req.body.fname == "") {
        res.status(500).json({"status": 500, "error": {"message":"field 'fname' is not valid"}, "response":null});
    }
    if (req.body.lname == null || req.body.lname == "") {
        res.status(500).json({"status": 500, "error": {"message":"field 'lname' is not valid"}, "response":null});
    }
    if (req.body.email == null || req.body.email == "") {
        res.status(500).json({"status": 500, "error": {"message":"field 'email' is not valid"}, "response":null});
    }
    if (req.body.dob == null || req.body.dob == "") {
        res.status(500).json({"status": 500, "error": {"message":"field 'dob' is not valid"}, "response":null});
    }
    if (req.body.password == null || req.body.password == "") {
        res.status(500).json({"status": 500, "error": {"message":"field 'password' is not valid"}, "response":null});
    }


    var account = {
        "type": req.body.type,
        "fname": req.body.fname,
        "lname": req.body.lname,
        "email": req.body.email,
        //password field not in account????
        //"password":req.body.password,
        "dob": req.body.dob,
        //"street1": req.body.street1,
        //"street2": req.body.street2,
        //"town": req.body.town,
        //"postcode": req.body.postcode,
        //"cardNo": req.body.cardNo,
        //"expiry": req.body.expiry,
        //"membership": req.body.membership
    };



    let hashedpassword = "";
    try {
        hashedpassword = await argon2.hash(req.body.password);
    } catch (err) {
        console.log("hashing error");
    }

    var login = {
        "email": req.body.email,

        "password": hashedpassword
    }

    //insertion query into mysql for adding a new account to database


    /* Begin transaction */
    res.locals.connection.beginTransaction(function (err) {
        try {
            if (err) {
                res.status(500).json({"status": 500, "error": err, "response":null});
                throw err;
            }
            res.locals.connection.query('INSERT INTO `Logins` SET ? ', login, function (err, result) {
                if (err) {
                    if (err.code=="ER_DUP_ENTRY") {
                        res.status(409).json({"status": 409, "error": {"code": err.code, "message": err.sqlMessage}, "response": null})
                    } else {
                        res.status(500).json({"status": 500, "error": err, "response": null});
                    }
                    res.locals.connection.rollback(function () {
                        throw err;
                    });
                }

                var log = result.insertId;

                res.locals.connection.query('INSERT INTO `Account` SET ?', account, function (err, resultAcc) {
                    if (err) {
                        if (err.code=="ER_DUP_ENTRY") {
                            res.status(409).json({"status": 409, "error": {"code": err.code, "message": err.sqlMessage}, "response": null})
                        } else {
                            res.status(500).json({"status": 500, "error": err, "response": null});
                        }
                        res.locals.connection.rollback(function () {
                            throw err;
                        });
                    }
                    res.locals.connection.commit(function (err) {
                        if (err) {
                            res.status(500).json({"status": 500, "error": err, "response":null});
                            res.locals.connection.rollback(function () {
                                throw err;
                            });
                        }
                        console.log('Transaction Complete.');
                        res.locals.connection.end();
                    });

                    let token = jwt.sign({username: req.body.email},
                        options.config.secret,
                        {expiresIn: '14d'});



                    res.status(200).json({
                        "status": 200, "error": null, "response": {
                            success: true,
                            message: "Successfully registered and logged in",
                            token: token,
                            userid: resultAcc.insertId,
                            loginResult: result,
                            accountResult: resultAcc
                        }
                    });

                });
            });
        } catch (err) {
            res.status(200).json({"status": 500, "error": err, "response":null});
        }
    });
    /* End transaction */

}

registerGuest = async function(req,res) {
    // console.log("req",req.body);

    let email = Date.now().toString() + (Math.random() * (1000-100) + 100) + "@guest.com";

    var account = {
        "type": "guest",
        "email": email,
    };



    let hashedpassword = "";
    try {
        hashedpassword = await argon2.hash(req.body.password);
    } catch (err) {
        console.log("hashing error");
    }

    var login = {
        "email": email
    }

    //insertion query into mysql for adding a new account to database


    /* Begin transaction */
    res.locals.connection.beginTransaction(function (err) {
        try {
            if (err) {
                res.status(500).json({"status": 500, "error": err, "response":null});
                throw err;
            }
            res.locals.connection.query('INSERT INTO `Logins` SET ? ', login, function (err, result) {
                if (err) {
                    if (err.code=="ER_DUP_ENTRY") {
                        res.status(409).json({"status": 409, "error": {"code": err.code, "message": err.sqlMessage}, "response": null})
                    } else {
                        res.status(500).json({"status": 500, "error": err, "response": null});
                    }
                    res.locals.connection.rollback(function () {
                        throw err;
                    });
                }

                var log = result.insertId;

                res.locals.connection.query('INSERT INTO `Account` SET ?', account, function (err, resultAcc) {
                    if (err) {
                        if (err.code=="ER_DUP_ENTRY") {
                            res.status(409).json({"status": 409, "error": {"code": err.code, "message": err.sqlMessage}, "response": null})
                        } else {
                            res.status(500).json({"status": 500, "error": err, "response": null});
                        }
                        res.locals.connection.rollback(function () {
                            throw err;
                        });
                    }
                    res.locals.connection.commit(function (err) {
                        if (err) {
                            res.status(500).json({"status": 500, "error": err, "response":null});
                            res.locals.connection.rollback(function () {
                                throw err;
                            });
                        }
                        console.log('Transaction Complete.');
                        res.locals.connection.end();
                    });

                    let token = jwt.sign({username: email},
                        options.config.secret,
                        {expiresIn: '14d'});



                    res.status(200).json({
                        "status": 200, "error": null, "response": {
                            success: true,
                            message: "Successfully registered as guest and logged in",
                            token: token,
                            userType: "guest",
                            email: email,
                            userid: resultAcc.insertId,
                            loginResult: result,
                            accountResult: resultAcc
                        }
                    });

                });
            });
        } catch (err) {
            res.status(200).json({"status": 500, "error": err, "response":null});
        }
    });
    /* End transaction */

}

//handler for user login and validating user credentials

loginUser = async function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    res.locals.connection.query('SELECT Logins.email as email, Logins.password as password, Logins.accessToken as token, Account.userid as userid FROM Logins, Account WHERE Logins.email = Account.email AND Logins.email = ?',[email], async function (error, results, fields) {
        if (error) {
            res.json({"status": 500, "error": error, "response": null});
        }else{
            console.log('The solution is: ', results);
            if(results.length >0){
                try {
                    if (await argon2.verify(results[0].password, password)) {
                        // Logged in correct, lets assign a token now
                        let token = jwt.sign({username: email},
                            options.config.secret,
                            { expiresIn: '14d'});



                        res.json({"status": 200, "error": null, "response": {
                                success: true,
                                message: "Successfully logged in",
                                userid: results[0].userid,
                                token: token
                            }});
                    } else {
                        res.json({"status": 403, "error": null, "response": {
                                success: false,
                                message: "Email and Password do not match"
                            }});
                    }
                } catch (err) {
                    //pls dont error
                    console.log("uh oh i did an oopsie poopsie");
                    console.log(err);
                }
            } else{
                res.json({"status": 400, "error": null, "response": {
                        success: false,
                        message: "Email does not exist!"
                    }});
            }
        }
    });
}


module.exports = {
    register: registerUser,
    login: loginUser,
    registerGuest: registerGuest
};