var express = require('express');
var router = express.Router();
let authMiddle = require("./auth/authenticate");

// ------------------------ MANAGEMENT -----------------------------


router.get('/bookings/:period?', authMiddle.authTokenManager, function (req, res, next) {
    let query = 'SELECT count(*) as "bookings" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 1 DAY)';
    if (req.params.period == "24h") {
        query = 'SELECT count(*) as "bookings" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 1 DAY)';
    }
    if (req.params.period == "week") {
        query = 'SELECT count(*) as "bookings" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 7 DAY)';
    }
    if (req.params.period == "month") {
        query = 'SELECT count(*) as "bookings" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 1 MONTH)';
    }
    if (req.params.period == "all") {
        query = 'SELECT count(*) as "bookings" FROM `Reservation`';
    }


    res.locals.connection.query(query,
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
            }
        });
});

router.get('/activeusers/:period?', authMiddle.authTokenManager, function (req, res, next) {

    let query = 'SELECT count(DISTINCT userID) as "activeUsers" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 1 DAY)';
    if (req.params.period == "24h") {
        query = 'SELECT count(DISTINCT userID) as "activeUsers" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 1 DAY)';
    }
    if (req.params.period == "week") {
        query = 'SELECT count(DISTINCT userID) as "activeUsers" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 7 DAY)';
    }
    if (req.params.period == "month") {
        query = 'SELECT count(DISTINCT userID) as "activeUsers" FROM `Reservation` WHERE `createdTime` >= (CURDATE() - INTERVAL 1 MONTH)';
    }
    if (req.params.period == "all") {
        query = 'SELECT count(DISTINCT userID) as "activeUsers" FROM `Reservation`';
    }

    res.locals.connection.query(query,
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
            }
        });

});

router.get('/activedock/:period?', authMiddle.authTokenManager, function (req, res, next) {

    let query = 'SELECT dockID,\n' +
        'COUNT(resID) as "count"\n' +
        'FROM Dock, Reservation\n' +
        'WHERE Dock.dockID = Reservation.pickupDock\n' +
        'AND DATE(Reservation.timeFrom) >  CURDATE() - INTERVAL 1 DAY\n' +
        'GROUP BY dockID\n' +
        'ORDER BY count(resID)\n' +
        'DESC LIMIT 1';

    if (req.params.period == "week") {
        query = 'SELECT dockID,\n' +
            'COUNT(resID as "count")\n' +
            'FROM Dock, Reservation\n' +
            'WHERE Dock.dockID = Reservation.pickupDock\n' +
            'AND DATE(Reservation.timeFrom) >  CURDATE() - INTERVAL 7 DAY\n' +
            'GROUP BY dockID\n' +
            'ORDER BY count(resID)\n' +
            'DESC LIMIT 1';
    }
    if (req.params.period == "month") {
        query = 'SELECT dockID,\n' +
            'COUNT(resID) as "count"\n' +
            'FROM Dock, Reservation\n' +
            'WHERE Dock.dockID = Reservation.pickupDock\n' +
            'AND DATE(Reservation.timeFrom) >  CURDATE() - INTERVAL 30 DAY\n' +
            'GROUP BY dockID\n' +
            'ORDER BY count(resID)\n' +
            'DESC LIMIT 1;';
    }
    if (req.params.period == "all") {
        query = 'SELECT dockID,\n' +
            'COUNT(resID) as "count"\n' +
            'FROM Dock, Reservation\n' +
            'WHERE Dock.dockID = Reservation.pickupDock\n' +
            'GROUP BY dockID\n' +
            'ORDER BY count(resID)\n' +
            'DESC LIMIT 1';
    }

    res.locals.connection.query(query,
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
                res.locals.connection.end();
            }
        });

});


router.get('/damagedBikes/', authMiddle.authTokenManager, function (req, res, next) {

    let query = 'SELECT COUNT(Bike.bikeID) as "damagedBikes" FROM Bike WHERE Bike.usable = "no"';


    res.locals.connection.query(query,
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
                res.locals.connection.end();
            }
        });

});

router.get('/averageSession/:period?', authMiddle.authTokenManager, function (req, res, next) {

    let query = 'SELECT (AVG(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))) as "avgsession" FROM Reservation WHERE DATE(Reservation.timeFrom) > CURDATE() - INTERVAL 1 DAY;';
    if (req.params.period == "24h") {
        query = 'SELECT (AVG(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))) as "avgsession"FROM Reservation WHERE DATE(Reservation.timeFrom) > CURDATE() - INTERVAL 1 DAY;';
    }
    if (req.params.period == "week") {
        query = 'SELECT (AVG(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))) as "avgsession" FROM Reservation WHERE DATE(Reservation.timeFrom) > CURDATE() - INTERVAL 7 DAY;';
    }
    if (req.params.period == "month") {
        query = 'SELECT (AVG(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))) as "avgsession" FROM Reservation WHERE DATE(Reservation.timeFrom) > CURDATE() - INTERVAL 30 DAY;';
    }
    if (req.params.period == "all") {
        query = 'SELECT (AVG(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))) as "avgsession" FROM Reservation;';
    }

    res.locals.connection.query(query,
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
                res.locals.connection.end();
            }
        });

});

router.get('/earnings/:period?', authMiddle.authTokenManager, function (req, res, next) {

    let query = 'SELECT ((sum(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))/ 1)*1.3) AS "earnings" FROM Reservation WHERE Reservation.status="ended" AND DATE(Reservation.timeFrom) =  CURDATE()';
    if (req.params.period == "24h") {
        query = 'SELECT ((sum(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))/ 1)*1.3) AS "earnings" FROM Reservation WHERE Reservation.status="ended" AND DATE(Reservation.timeFrom) =  CURDATE()';
    }
    if (req.params.period == "week") {
        query = 'SELECT ((sum(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))/ 1)*1.3) AS "earnings" FROM Reservation WHERE Reservation.status="ended" AND DATE(Reservation.timeFrom) >  CURDATE() - INTERVAL 7 DAY;';
    }
    if (req.params.period == "month") {
        query = 'SELECT ((sum(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))/ 1)*1.3) AS "earnings" FROM Reservation WHERE Reservation.status="ended" AND DATE(Reservation.timeFrom) >  CURDATE() - INTERVAL 30 DAY;';
    }
    if (req.params.period == "all") {
        query = 'SELECT ((sum(TIMESTAMPDIFF(hour, Reservation.timeFrom, Reservation.timeUntil))/ 1)*1.3) AS "earnings" FROM Reservation WHERE Reservation.status="ended";';
    }

    res.locals.connection.query(query,
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
                res.locals.connection.end();
            }
        });

});


//TODO: manage bike stuffz
router.post('/bikes/move', authMiddle.authToken, function (req, res, next) {

    if (req.decoded.type != "manager" && req.decoded.type != "operator") {
        return res.status(400).json({
            status: 400,
            error: null,
            response: {message: "Not authorized to perform this action"}
        });
    }

    console.log(req.body);

    let insertData = {
        bikeCount: 0,
        bikeType: "standard",
        fromDock: -1,
        toDock: -1
    };

    if (req.body.bikeCount == undefined || req.body.bikeCount == "") {
        return res.status(400).json({status:400,error:null,response:{message:"Field `bikeCount` is invalid"}});
    } else {
        insertData.bikeCount = req.body.bikeCount;
    }

    if (req.body.bikeType == undefined) {
        return res.status(400).json({status:400,error:null,response:{message:"Field `bikeType` is invalid"}});
    } else {
        insertData.bikeType = req.body.bikeType;
    }

    if (req.body.fromDock == undefined || req.body.fromDock == "") {
        return res.status(400).json({status:400,error:null,response:{message:"Field `fromDock` is invalid"}});
    } else {
        insertData.fromDock = req.body.fromDock;
    }

    if (req.body.toDock == undefined || req.body.toDock == "") {
        return res.status(400).json({status:400,error:null,response:{message:"Field `toDock` is invalid"}});
    } else {
        insertData.toDock = req.body.toDock;
    }



    res.locals.connection.beginTransaction(function (err) {
        try {
            if (err) {
                res.status(500).json({"status": 500, "error": err, "response": null});
                throw err;
            }

            //check there are enough slots at new dock
            // check there are enough bikes at from dock
            res.locals.connection.query('SELECT capacity-count(bikeID) as "slots" FROM `Bike`, `Dock` WHERE `Dock`.dockID = `Bike`.dock AND `Dock`.dockID = ?',
                [insertData.toDock], function (err, results) {
                    if (err) {
                        res.status(500).json({"status": 500, "error": err, "response": null});
                        res.locals.connection.rollback(function () {
                            throw err;
                        });
                    } else {
                        if (results[0].slots < insertData.bikeCount) {
                            res.status(400).json({
                                "status": 400,
                                "error": null,
                                "response": {message: "Not enough free slots at selected dock"}
                            });
                            res.locals.connection.rollback(function () {
                                throw err;
                            });
                        } else {
                            res.locals.connection.query('SELECT bikeID FROM `Dock`, `Bike` WHERE `Dock`.dockID = `Bike`.dock AND `Dock`.dockID = ? AND `Bike`.type = ? AND `Bike`.bikeID NOT IN (SELECT bikeID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` <= (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved") AND bikeID IS NOT NULL)',
                                [insertData.fromDock, insertData.bikeType], function (err, result) {
                                    if (err) {
                                        res.status(500).json({"status": 500, "error": err, "response": null});
                                        res.locals.connection.rollback(function () {
                                            throw err;
                                        });
                                    } else {
                                        if (result.length <= 0 || result.length < insertData.bikeCount) {
                                            res.status(400).json({"status": 400, "error": result, "response": {message:"There are not enough bikes from the specified dock that can be moved"}});
                                            return res.locals.connection.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        let bikes = [];
                                        for (var i = 0; i < insertData.bikeCount; i++) {
                                            bikes.push(result[i].bikeID);
                                        }

                                        res.locals.connection.query('UPDATE `Bike` SET `Bike`.longitude=NULL, `Bike`.latitude = NULL, `Bike`.dock = ?' +
                                            ' WHERE `Bike`.bikeID IN (?)',
                                            [insertData.toDock, bikes], function (err, resultb) {
                                                if (err) {
                                                    res.status(500).json({
                                                        "status": 500,
                                                        "error": err,
                                                        "response": null
                                                    });
                                                    res.locals.connection.rollback(function () {
                                                        throw err;
                                                    });
                                                } else {


                                                    res.locals.connection.commit(function (err) {
                                                        if (err) {
                                                            res.status(500).json({
                                                                "status": 500,
                                                                "error": err,
                                                                "response": null
                                                            });
                                                            res.locals.connection.rollback(function () {
                                                                throw err;
                                                            });
                                                        } else {
                                                            let info = {
                                                                "affectedRows": resultb.affectedRows,
                                                                "bikesMoves": resultb.affectedRows,
                                                                "message": "Successfully moved " + resultb.affectedRows + " " + insertData.bikeType + " bikes from Dock " + insertData.fromDock + " to Dock " + insertData.toDock
                                                            };
                                                            res.status(200).json({
                                                                status: 200,
                                                                error: null,
                                                                response: info
                                                            });

                                                            console.log('Transaction Complete.');
                                                            res.locals.connection.end();
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                });
                        }

                    }

                });

        } catch
            (err) {
            res.status(500).json({"status": 500, "error": err, "response": null});
        }
    })
    ;


})
;


module.exports = router;
