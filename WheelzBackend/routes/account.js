var express = require('express');
var router = express.Router();
var accountHelper = require("./createAccount");
let authMiddle = require("./auth/authenticate");


router.get('/', authMiddle.authToken, function (req, res, next) {

    res.locals.connection.query('SELECT * FROM `Account` WHERE `userID` = ?', [req.decoded.userid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});


router.get('/type/', authMiddle.authToken, function (req, res, next) {

    res.locals.connection.query('SELECT type FROM `Account` WHERE `userID` = ?', [req.decoded.userid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.post('/buypass/', authMiddle.authToken, function (req, res, next) {

    if (req.body.type != "annual" || req.body.type != "day") {
        return res.status(400).json({"status": 400, "error": {"message": "Invalid 'type' submitted! Only annual and day are accepted."}, "response": null});
    }

    let sql = 'INSERT INTO `Pass` (`userid`, `type`, `activationDate`, `expiryDate`) VALUES (?, ?, CURDATE(), CURDATE() + INTERVAL 1 DAYS)';
    if (req.body.type == "annual") {
        sql = 'INSERT INTO `Pass` (`userid`, `type`, `activationDate`, `expiryDate`) VALUES (?, ?, CURDATE(), CURDATE() + INTERVAL 365 DAYS)';
    }

    res.locals.connection.query(sql, [req.decoded.userid, req.body.type],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 201, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/id/:userid', authMiddle.authTokenAndUserId, function (req, res, next) {

    res.locals.connection.query('SELECT * FROM `Account` WHERE `userID` = ?', [req.params.userid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/checktoken', authMiddle.checkToken, function (req, res, next) {
    return;
})

router.post('/create', accountHelper.register);
router.post('/login', accountHelper.login);
router.post('/guest', accountHelper.registerGuest);

//TODO: account creation routes, and authentication


module.exports = router;