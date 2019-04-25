var express = require('express');
var router = express.Router();
let authMiddle = require("./auth/authenticate");


router.get('/all/:order?', authMiddle.authToken, function (req, res, next) {
    // Optional ordering
    let order = "ASC";
    if (req.params.order) {
        if (req.params.order.toLowerCase() == "desc") {
            order = "DESC";
        } else if (req.params.order.toLowerCase() == "asc") {
            order = "ASC";
        }
    }

    // SQL for getting all reservations for the user that accessed it (authenticated)
    res.locals.connection.query('SELECT * FROM `Reservation` WHERE `userID` = ? ORDER BY `timeFrom` ' + order, [req.decoded.userid],
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

// get specific information on a reservation, authenticated
router.get('/id/:resid', authMiddle.authToken, function (req, res, next) {
    res.locals.connection.query('SELECT * FROM `Reservation` WHERE `resID` = ? AND `userID` = ?', [req.params.resid, req.decoded.userid],
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

// gets the gear related to the reservation
router.get('/id/:resid/gear', authMiddle.authToken, function (req, res, next) {
    res.locals.connection.query('SELECT `Gear`.gearID, `Gear`.resID, `Gear`.type, `Gear`.location FROM `Gear`, `Reservation` WHERE `Reservation`.resID = `Gear`.resID AND `Reservation`.resID = ? AND `Reservation`.userID = ?', [req.params.resid, req.decoded.userid],
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

//Cancel a gear reservation
router.post('/id/:resid/gear/cancel', authMiddle.authToken, function (req, res, next) {

    res.locals.connection.query('SELECT `Gear`.gearID, `Gear`.resID, `Gear`.type, `Gear`.location FROM `Gear`, `Reservation` WHERE `Reservation`.resID = `Gear`.resID AND `Reservation`.resID = ? AND `Reservation`.userID = ?', [req.params.resid, req.decoded.userid],
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.status(200);
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

//Create a gear reservation
router.post('/id/:resid/gear/create', authMiddle.authToken, function (req, res, next) {
    //Ensure the user created the reservation
    res.locals.connection.query('SELECT `resID` FROM `Reservation` WHERE `resID` = ? AND `userID` = ?', [req.params.resid, req.decoded.userid],
        function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
                res.locals.connection.end();
            } else {
                if (results.length <= 0) {
                    return res.status(400).json({
                        "status": 500,
                        "error": null,
                        "response": {message: "User not authorized to add gear to the specified reservation"}
                    });
                }

                createGearRes(req, res, req.body, function (err, result) {
                    res.locals.connection.end();
                    return res.status(201).json(result);
                });

            }
        });
});

function createGearRes(req, res, gearSet, callback) {
    // Load defaults for the gear
    let insertData = {
        "helmet": 0,
        "pump": 0,
        "kneeGuard": 0,
        "elbowPads": 0,
        "waterBottle": 0
    };

    // validate user input and load it
    if (gearSet.helmet) {
        if (parseInt(gearSet.helmet) != 0 && parseInt(gearSet.helmet) != 1) {
            res.status(400).json({
                status: 400,
                error: null,
                response: {message: "Field `helmet` is not valid, expecting 0 or 1"}
            });
        } else insertData.helmet = parseInt(gearSet.helmet);
    }
    if (gearSet.pump) {
        if (parseInt(gearSet.pump) != 0 && parseInt(gearSet.pump) != 1) {
            res.status(400).json({
                status: 400,
                error: null,
                response: {message: "Field `pump` is not valid, expecting 0 or 1"}
            });
        } else insertData.pump = parseInt(gearSet.pump);
    }
    if (gearSet.kneeGuard) {
        if (parseInt(gearSet.kneeGuard != 0) && parseInt(gearSet.kneeGuard) != 1) {
            res.status(400).json({
                status: 400,
                error: null,
                response: {message: "Field `kneeGuard` is not valid, expecting 0 or 1"}
            });
        } else insertData.kneeGuard = parseInt(gearSet.kneeGuard);
    }
    if (gearSet.elbowPads) {
        if (parseInt(gearSet.elbowPads) != 0 && parseInt(gearSet.elbowPads) != 1) {
            res.status(400).json({
                status: 400,
                error: null,
                response: {message: "Field `elbowPads` is not valid, expecting 0 or 1"}
            });
        } else insertData.elbowPads = parseInt(gearSet.elbowPads);
    }
    if (gearSet.waterBottle) {
        if (parseInt(gearSet.waterBottle) != 0 && parseInt(gearSet.waterBottle) != 1) {
            res.status(400).json({
                status: 400,
                error: null,
                response: {message: "Field `waterBottle` is not valid, expecting 0 or 1"}
            });
        } else insertData.waterBottle = parseInt(gearSet.waterBottle);
    }

    let results = {
        "status": 201,
        "error": null,
        response: {helmet: {}, pump: {}, kneeGuard: {}, elbowPads: {}, waterBottle: {}}
    };

    // Begin the transaction
    res.locals.connection.beginTransaction(function (err) {
        try {
            if (err) {
                results.status = 500;
                res.status(500).json({"status": 500, "error": err, "response": null});
                throw err;
            }

            //Try to insert the gear for each type
            res.locals.connection.query(['SELECT `gearID` FROM `Gear` WHERE `type`=? AND `resID`=?', 'INSERT INTO `Gear` (`type`, `location`, `resID`) SELECT ?, (SELECT pickupDock FROM `Reservation` WHERE `resID`=? LIMIT 1), ? FROM dual WHERE NOT EXISTS (SELECT * FROM `Gear` WHERE `resID`=? AND `type` = ?)'][insertData.helmet],
                ['helmet', req.params.resid, req.params.resid, req.params.resid, 'helmet'], function (err, result) {
                    if (err) {
                        if (err.code == "ER_DUP_ENTRY") {
                            results.status = 409;
                            res.status(409).json({
                                "status": 409,
                                "error": {"code": err.code, "message": err.sqlMessage},
                                "response": null
                            })
                        } else {
                            results.status = 500;
                            res.status(500).json({"status": 500, "error": err, "response": null});
                        }
                        res.locals.connection.rollback(function () {
                            throw err;
                        });
                    }
                    // Add the results to the main response
                    if (result.insertId) {
                        let info = {
                            "gearID": result.insertId,
                            "affectedRows": result.affectedRows,
                            "message": "Successfully created helmet reservation"
                        };

                        results.response.helmet = info;
                    }

                    // Repeat of above
                    res.locals.connection.query(['SELECT `gearID` FROM `Gear` WHERE `type`=? AND `resID`=? AND `resID`=?', 'INSERT INTO `Gear` (`type`, `location`, `resID`) SELECT ?, (SELECT pickupDock FROM `Reservation` WHERE `resID`=? LIMIT 1), ? FROM dual WHERE NOT EXISTS (SELECT * FROM `Gear` WHERE `resID`=? AND `type` = ?)'][insertData.pump],
                        ['pump', req.params.resid, req.params.resid, req.params.resid, 'pump'], function (err, result) {
                            if (err) {
                                if (err.code == "ER_DUP_ENTRY") {
                                    results.status = 409;
                                    res.status(409).json({
                                        "status": 409,
                                        "error": {"code": err.code, "message": err.sqlMessage},
                                        "response": null
                                    })
                                } else {
                                    results.status = 500;
                                    res.status(500).json({"status": 500, "error": err, "response": null});
                                }
                                res.locals.connection.rollback(function () {
                                    throw err;
                                });
                            } else {
                                if (result.insertId) {
                                    let info = {
                                        "gearID": result.insertId,
                                        "affectedRows": result.affectedRows,
                                        "message": "Successfully created pump reservation"
                                    };

                                    results.response.pump = info;
                                }
                                let sql = ['SELECT `gearID` FROM `Gear` WHERE `type`=? AND `resID`=? AND `resID`=?', 'INSERT INTO `Gear` (`type`, `location`, `resID`) SELECT ?, (SELECT pickupDock FROM `Reservation` WHERE `resID`=? LIMIT 1), ? FROM dual WHERE NOT EXISTS (SELECT * FROM `Gear` WHERE `resID`=? AND `type` = ?)'][insertData.kneeGuard];
                                res.locals.connection.query(sql,
                                    ['knee guard', req.params.resid, req.params.resid, req.params.resid, 'knee guard'], function (err, result) {
                                        if (err) {
                                            if (err.code == "ER_DUP_ENTRY") {
                                                results.status = 409;
                                                res.status(409).json({
                                                    "status": 409,
                                                    "error": {"code": err.code, "message": err.sqlMessage},
                                                    "response": null
                                                })
                                            } else {
                                                results.status = 500;
                                                res.status(500).json({
                                                    "status": 500,
                                                    "error": err,
                                                    "response": null
                                                });
                                            }
                                            res.locals.connection.rollback(function () {
                                                throw err;
                                            });
                                        } else {
                                            if (result.insertId) {
                                                let info = {
                                                    "gearID": result.insertId,
                                                    "affectedRows": result.affectedRows,
                                                    "message": "Successfully created knee guard reservation"
                                                };

                                                results.response.kneeGuard = info;
                                            }

                                            res.locals.connection.query(['SELECT `gearID` FROM `Gear` WHERE `type`=? AND `resID`=? AND `resID`=?', 'INSERT INTO `Gear` (`type`, `location`, `resID`) SELECT ?, (SELECT pickupDock FROM `Reservation` WHERE `resID`=? LIMIT 1), ? FROM dual WHERE NOT EXISTS (SELECT * FROM `Gear` WHERE `resID`=? AND `type` = ?)'][insertData.elbowPads],
                                                ['elbow pads', req.params.resid, req.params.resid, req.params.resid, 'elbow pads'], function (err, result) {
                                                    if (err) {
                                                        if (err.code == "ER_DUP_ENTRY") {
                                                            results.status = 409;
                                                            res.status(409).json({
                                                                "status": 409,
                                                                "error": {
                                                                    "code": err.code,
                                                                    "message": err.sqlMessage
                                                                },
                                                                "response": null
                                                            })
                                                        } else {
                                                            results.status = 500;
                                                            res.status(500).json({
                                                                "status": 500,
                                                                "error": err,
                                                                "response": null
                                                            });
                                                        }
                                                        res.locals.connection.rollback(function () {
                                                            throw err;
                                                        });
                                                    } else {
                                                        if (result.insertId) {
                                                            let info = {
                                                                "gearID": result.insertId,
                                                                "affectedRows": result.affectedRows,
                                                                "message": "Successfully created elbow pads reservation"
                                                            };

                                                            results.response.elbowPads = info;
                                                        }


                                                        res.locals.connection.query(['SELECT `gearID` FROM `Gear` WHERE `type`=? AND `resID`=? AND `resID`=?', 'INSERT INTO `Gear` (`type`, `location`, `resID`) SELECT ?, (SELECT pickupDock FROM `Reservation` WHERE `resID`=? LIMIT 1), ? FROM dual WHERE NOT EXISTS (SELECT * FROM `Gear` WHERE `resID`=? AND `type` = ?)'][insertData.waterBottle],
                                                            ['water bottle', req.params.resid, req.params.resid, req.params.resid, 'water bottle'], function (err, result) {
                                                                if (err) {
                                                                    if (err.code == "ER_DUP_ENTRY") {
                                                                        results.status = 409;
                                                                        res.status(409).json({
                                                                            "status": 409,
                                                                            "error": {
                                                                                "code": err.code,
                                                                                "message": err.sqlMessage
                                                                            },
                                                                            "response": null
                                                                        })
                                                                    } else {
                                                                        results.status = 500;
                                                                        res.status(500).json({
                                                                            "status": 500,
                                                                            "error": err,
                                                                            "response": null
                                                                        });
                                                                    }
                                                                    res.locals.connection.rollback(function () {
                                                                        throw err;
                                                                    });
                                                                } else {
                                                                    if (result.insertId) {

                                                                        let info = {
                                                                            "gearID": result.insertId,
                                                                            "affectedRows": result.affectedRows,
                                                                            "message": "Successfully created water bottle reservation"
                                                                        };

                                                                        results.response.waterBottle = info;
                                                                    }

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
                                                                        }
                                                                        console.log('Transaction Complete.');
                                                                        //res.locals.connection.end();
                                                                        callback(null, results);
                                                                    });
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                });


        } catch (err) {
            results.status = 500;
            res.status(500).json({"status": 500, "error": err, "response": null});
        }
    });
}
router.post('/create', function (req, res, next) {

    // add type for reserving a bike of x type
    if (req.body.bikeType == undefined || req.body.bikeType == "") {
        req.body.bikeType = "standard";
    }

    // Check type is valid
    if (req.body.bikeType != "standard" && req.body.bikeType != "mountain" && req.body.bikeType != "road") {
        return res.status(400).json({
            "status": 400,
            "error": {"message": "Field 'bikeType' is not valid"},
            "response": null
        });
    }

    //validate the data
    if (req.body.pickupDock == undefined || req.body.pickupDock == "" || parseInt(req.body.pickupDock) < 0) {
        return res.status(400).json({
            "status": 400,
            "error": {"message": "Field 'pickupDock' is not valid"},
            "response": null
        });
    }
    if (req.body.timeFrom == undefined || req.body.timeFrom == "" || Date.parse(req.body.timeFrom) == NaN) {
        return res.status(400).json({
            "status": 400,
            "error": {"message": "Field 'timeFrom' is not valid"},
            "response": null
        });
    }

    // check user id
    if (req.body.userID == undefined) {
        req.body.userID = authMiddle.getUserIdFromToken(req, res, next);
        if (req.body.userID == -1) {
            req.body.userID = null;
        }
        //return res.status(400).json({"status": 400, "error": {"message": "Field 'userID' is not valid"}, "response":null});
    }

    if (req.body.status == undefined || req.body.status == "") {
        req.body.status = "reserved";
    }

    if (req.body.gear == undefined || req.body.gear == "") {
        // define the default gear setup
        req.body.gear = {
            "helmet": 0,
            "pump": 0,
            "kneeGuard": 0,
            "elbowPads": 0,
            "waterBottle": 0
        };
    }

    let timeFrom = new Date(req.body.timeFrom);

    let bikeID = null;

    if (req.body.bikeID == undefined) {
        // Auto assign bike id (deprecated as app performs the selecting of bikes)
        // if (timeFrom.toDateString() == new Date().toDateString()) {
        //     res.locals.connection.query('SELECT bikeID FROM `Bike` WHERE ' +
        //         '`dock` = ? AND bikeID NOT IN (SELECT bikeID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` < (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved") AND bikeID IS NOT NULL) LIMIT 1', [req.body.pickupDock],
        //         function (error, results, fields) {
        //             if (error) {
        //                 return res.status(500).json({"status": 500, "error": error, "response": null});
        //             } else {
        //                 if (results.length <= 0) {
        //                     //no bikes free at dock
        //                     return res.status(400).json({
        //                         "status": 400,
        //                         "error": {message: "No available bikes at location"},
        //                         "response": null
        //                     });
        //                 }
        //                 bikeID = results[0].bikeID;
        //             }
        //         });
        // }
    } else {
        bikeID = req.body.bikeID;
    }

    let insertData;

    if (bikeID) {
        insertData = {
            userID: req.body.userID,
            pickupDock: req.body.pickupDock,
            bikeType: req.body.bikeType,
            timeFrom: req.body.timeFrom,
            //timeUntil: req.body.timeUntil,
            status: req.body.status,
            createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            bikeID: bikeID
        };
    } else {
        insertData = {
            userID: req.body.userID,
            pickupDock: req.body.pickupDock,
            bikeType: req.body.bikeType,
            timeFrom: req.body.timeFrom,
            //timeUntil: req.body.timeUntil,
            status: req.body.status,
            createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
    }

    //Begin the transaction to insert the reservation data
    res.locals.connection.beginTransaction(function (err) {
        try {
            if (err) {
                res.status(500).json({"status": 500, "error": err, "response": null});
                throw err;
            }

            res.locals.connection.query('SELECT capacity-COUNT(resID) AS `freeReservations`, capacity FROM `Reservation`, `Dock` WHERE ' +
                '`pickupDock` = `dockID` AND `dockID` = ? AND (`timeFrom` >= DATE(?) AND `timeFrom` <= (DATE(?) + INTERVAL 1 DAY)) AND (status="active" or status="reserved")',
                [insertData.pickupDock, insertData.timeFrom, insertData.timeFrom], function (error, results) {
                    if (err) {
                        res.status(500).json({"status": 500, "error": er, "response": null});

                        res.locals.connection.rollback(function () {
                            throw err;
                        });
                    } else {
                        if (results[0].freeReservations <= 0) {
                            res.status(400).json({
                                "status": 400,
                                "error": null,
                                "response": {
                                    affectedRows: 0,
                                    message: "No reservation slots free for selected dock on that date."
                                }
                            })
                            res.locals.connection.rollback(function () {
                                throw err;
                            });
                        }

                        // Insert the actual data now
                        res.locals.connection.query("INSERT INTO `Reservation` SET ?",
                            insertData, function (error, results, fields) {
                                if (err) {
                                    if (err.code == "ER_DUP_ENTRY") {
                                        res.status(409).json({
                                            "status": 409,
                                            "error": {"code": err.code, "message": err.sqlMessage},
                                            "response": null
                                        })
                                    } else {
                                        res.status(500).json({"status": 500, "error": err, "response": null});
                                    }
                                    res.locals.connection.rollback(function () {
                                        throw err;
                                    });
                                } else {
                                    var info = {
                                        "resID": results.insertId,
                                        "affectedRows": results.affectedRows,
                                        "message": "Successfully created reservation"
                                    };

                                    req.params.resid = results.insertId;

                                    //Attempt to add gear if optional is given
                                    createGearRes(req, res, req.body.gear, function (err, result) {

                                        if (result.status != 201) {
                                            res.locals.connection.rollback(function () {
                                                throw err;
                                            });
                                            return;
                                        }
                                        info.gearReservation = result.response;


                                        res.locals.connection.commit(function (err) {
                                            if (err) {
                                                res.status(500).json({"status": 500, "error": err, "response": null});
                                                res.locals.connection.rollback(function () {
                                                    throw err;
                                                });
                                            }

                                            res.status(201).json({"status": 201, "error": null, "response": info});
                                            console.log('Transaction Complete.');
                                            res.locals.connection.end();
                                        });
                                    });
                                }
                            });
                    }
                });

        } catch (err) {
            res.status(500).json({"status": 500, "error": err, "response": null});
        }
    });


});


router.put('/end', authMiddle.authToken, function (req, res) {

    res.locals.connection.query('UPDATE `Reservation` SET `status`="ended" WHERE `resID` = ? AND `userID` = ?', [req.body.resID, req.decoded.userid], function (error, results, fields) {
        if (error) {
            res.status(500);
            res.json({"status": 500, "error": error, "response": null});
        } else {
            if (results.affectedRows <= 0) {
                res.status(400).json({
                    "status": 400,
                    "error": null,
                    "response": {"affectedRows": results.affectedRows, "message": "Failed to cancel reservation"}
                })
            }
            let info = {
                "affectedRows": results.affectedRows,
                "message": "Successfully cancelled reservation"
            };
            res.status(200);
            res.json({"status": 200, "error": null, "response": info});
        }
        res.locals.connection.end();
    });

});

router.put('/cancel', authMiddle.authToken, function (req, res) {

    res.locals.connection.query('UPDATE `Reservation` SET `status`="cancelled" WHERE `resID` = ? AND `userID` = ?', [req.body.resID, req.decoded.userid], function (error, results, fields) {
        if (error) {
            res.status(500);
            res.json({"status": 500, "error": error, "response": null});
        } else {
            if (results.affectedRows <= 0) {
                res.status(400).json({
                    "status": 400,
                    "error": null,
                    "response": {"affectedRows": results.affectedRows, "message": "Failed to cancel reservation"}
                })
            }
            let info = {
                "affectedRows": results.affectedRows,
                "message": "Successfully cancelled reservation"
            };
            res.status(200);
            res.json({"status": 200, "error": null, "response": info});
        }
        res.locals.connection.end();
    });

});

router.post('/modify', authMiddle.authToken, function (req, res) {
    // This method will take in a reservation id, authenticate that the user is allowed to modify the specific reservation and then do so.
    // Operators / managers should have override permissions for this



    //validate the new data

    let resInfo = null;
    console.log(req.body);
    console.log(req.decoded);

    //update the data
    res.locals.connection.query("SELECT * FROM `Reservation` WHERE `resID` = ? AND `userID` = ?", [req.body.resID, req.decoded.userid], function (error, results, fields) {
        if (error) {
            res.status(500);
            res.json({"status": 500, "error": error, "response": null});
        } else {
            console.log(results);

            if (results.length <= 0) {
                return res.status(400).json({
                    status: 400,
                    error: null,
                    response: {message: "No reservations found, hence cannot modify"}
                });
            }
            resInfo = results[0];


            if (req.body.bikeID == null || req.body.bikeID == undefined) {
                req.body.bikeID = resInfo.bikeID;
            }
            if (req.body.bikeType == null || req.body.bikeType == undefined) {
                req.body.bikeType = resInfo.bikeType;
            }
            if (req.body.pickupDock == null || req.body.pickupDock == undefined) {
                req.body.pickupDock = resInfo.pickupDock;
            }
            if (req.body.timeFrom == null || req.body.timeFrom == undefined) {
                req.body.timeFrom = resInfo.timeFrom;
            }
            if (req.body.timeUntil == null || req.body.timeUntil == undefined) {
                req.body.timeUntil = resInfo.timeUntil;
            }
            if (req.body.destination == null || req.body.destination == undefined) {
                req.body.destination = resInfo.destination;
            }
            if (req.body.routeTaken == null || req.body.routeTaken == undefined) {
                req.body.routeTaken = resInfo.routeTaken;
            }
            if (req.body.status == null || req.body.status == undefined) {
                req.body.status = resInfo.status;
            }
            if (req.body.userID == null || req.body.userID == undefined) {
                req.body.userID = resInfo.userID;
            }
            if (req.body.score == null || req.body.score == undefined) {
                req.body.score = resInfo.score;
            }

            if (req.body.feedback == undefined || req.body.feedback == null) {
                req.body.feedback = resInfo.feedback;
            }

            // update the reservation listing with the data
            res.locals.connection.query("UPDATE `Reservation` SET   `bikeID`=?, `bikeType`=?, `pickupDock`=?, `userID`=?, `timeFrom`=?, `timeUntil`=?, `destination`=?, `routeTaken`=?, `status`=?, `score`=?, `feedback`=? WHERE `resID`=?",
                [req.body.bikeID, req.body.bikeType, req.body.pickupDock, req.decoded.userid, req.body.timeFrom, req.body.timeUntil, req.body.destination, req.body.routeTaken, req.body.status, req.body.score, req.body.feedback, req.body.resID], function (error, results, fields) {
                    if (error) {

                        console.log(error);

                        res.status(500);
                        res.json({"status": 500, "error": error, "response": null});
                    } else {

                        let info = {
                            "affectedRows": results.affectedRows,
                            "message": "Successfully modified reservation"
                        };
                        res.status(200);
                        res.json({"status": 200, "error": null, "response": info});
                    }
                    res.locals.connection.end();
                });
        }

    });

});


// ------------------------ MANAGEMENT -----------------------------

router.get('/manage/count/:period?', authMiddle.authTokenManager, function (req, res, next) {
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
            res.locals.connection.end();
        });
});


module.exports = router;
