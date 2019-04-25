var express = require('express');
var router = express.Router();


//Returns all docks
//TODO: should place a limit on these should the system ever run at large scale
//TODO: (too much data to be handing about, probably paginate it)
//TODO: maybe add ?limit= option to it
router.get('/', function (req, res, next) {
    res.locals.connection.query('SELECT * FROM `Dock`',
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/id/:dockid/gear/', authMiddle.authToken, function (req, res, next) {
    res.locals.connection.query('SELECT type, count(`gearID`) AS `count` FROM `Dock`, `Gear` WHERE `Dock`.dockID = `Gear`.location AND `Dock`.dockID = ? AND `Gear`.resID IN (SELECT resID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` <= (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved")) GROUP BY type',
        [req.params.dockid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

//Gets the bike info
router.get('/id/:dockid/bikes/', function (req, res, next) {
    res.locals.connection.query('SELECT type, usable AS usable, count(`bikeID`) AS `count` FROM `Dock`, `Bike` WHERE `Dock`.dockID = `Bike`.dock AND `Dock`.dockID = ? GROUP BY type, usable',
        [req.params.dockid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

//Returns the dock based on the id
router.get('/id/:dockid', function (req, res, next) {
    res.locals.connection.query('SELECT * FROM `Dock` WHERE `dockID` = ?', [req.params.dockid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

//TODO: not sure on the best implementation for dealing with names and the closeness of names (say for search)
router.get('/name/:dockname(\\w+)', function (req, res, next) {
    res.locals.connection.query('SELECT * FROM `Dock` WHERE `dockName` LIKE ?', [req.params.dockname],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

// REMEMBER THAT THE EXPRESS REGEX MUST EXSCAPE ALL \\ CHARS


//This route returns the closest (any docks within the default 0.001 range)
router.get('/closest/:lat((-?[0-9]+.?[0-9]+?)),:long((-?[0-9]+.?[0-9]+?))', function (req, res, next) {
    let rangeOffset = 0.02;
    console.log(req.params.lat);
    console.log(req.params.long);
    console.log(rangeOffset);
    res.locals.connection.query('SELECT * FROM `Dock` WHERE (`latitude` >= ? AND `latitude` <= ? AND `longitude` >= ? AND `longitude` <= ?)',
        [req.params.lat - rangeOffset, req.params.lat + rangeOffset, req.params.long - rangeOffset, req.params.long + rangeOffset],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

//This route returns any docks within the defined range of the location
//'/range/:lat((-?[0-9]+(.[0-9]+)?)),:long((-?[0-9]+(.[0-9]+)?)),:range((-?[0-9]+(.[0-9]+)?))' old
//TODO: regex does work, however it is only returning a limited number of docks
router.get('/range/:lat((-?[0-9]+.?[0-9]+?)),:long((-?[0-9]+.?[0-9]+?)),:range((-?[0-9]+.?(\\d+)?))', function (req, res, next) {
    let rangeOffset = req.params.range;
    console.log(req.params.lat);
    console.log(req.params.long);
    console.log(req.params.range);
    res.locals.connection.query('SELECT * FROM `Dock` WHERE (`latitude` >= ? AND `latitude` <= ? AND `longitude` >= ? AND `longitude` <= ?)',
        [req.params.lat - rangeOffset, req.params.lat + rangeOffset, req.params.long - rangeOffset, req.params.long + rangeOffset],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/getbike/:dockid/:type?', function (req, res) {
    /* WIP command, not using it as I think the other one is better
    'SELECT B.bikeID FROM `Bike` as B, `Reservation` as R WHERE ' +
        '(B.bikeID = R.bikeID AND (R.timeFrom < CURDATE() OR R.timeFrom > (CURDATE() + INTERVAL 1 DAY)) AND B.dock = ?)' +
        'OR (`B.dock` = ? AND (`R.timeFrom` < CURDATE() OR `R.timeFrom` > (CURDATE() + INTERVAL 1 DAY)) AND NOT EXISTS (SELECT `bikeID` FROM `Reservation`))'

     */
    if (req.params.type == undefined || req.params.type == "") {
        req.params.type = 'standard';
    }
    if (req.params.type != 'standard' && req.params.type != 'mountain' && req.params.type != 'road') {
        res.status(400).json({"status":400, "error": null, "response": {"message": "Field `type` is not valid, must be either standard, mountain, or road."}});
        return;
    }

    //SELECT bikeID FROM `Bike` WHERE `dock` = ? AND `bikeID` NOT IN (SELECT bikeID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` < (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved"))

    res.locals.connection.query('SELECT bikeID FROM `Bike` WHERE ' +
        '`dock` = ? AND `type`=? AND `bikeID` NOT IN (SELECT bikeID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` < (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved") AND bikeID IS NOT NULL) LIMIT 1', [req.params.dockid, req.params.type],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                if (results.length <= 0) {
                    res.status(200).json({"status": 200, "error": null, "response": {"message": "No available bikes"}});
                } else {
                    res.json({"status": 200, "error": null, "response": results[0]});
                }
            }
            res.locals.connection.end();
        });
});

router.get('/freebikes/:dockid/:type?', function (req, res) {
    if (req.params.type == undefined || req.params.type == "") {
        req.params.type = 'standard';
    }
    if (req.params.type != 'standard' && req.params.type != 'mountain' && req.params.type != 'road') {
        res.status(400).json({"status":400, "error": null, "response": {"message": "Field `type` is not valid, must be either standard, mountain, or road."}});
        return;
    }
    //TODO should we include a new thing so when you leave type blank it will give you the lot of them grouped by type
    // So you get to see the total number of bikes and which types have how many?

    res.locals.connection.query('SELECT COUNT(bikeID) AS `freeBikes`, capacity FROM `Bike`, `Dock` WHERE ' +
        '`dock` = `dockID` AND `dock` = ? AND `type` = ? AND `bikeID` NOT IN (SELECT bikeID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` <= (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved") AND bikeID IS NOT NULL)', [req.params.dockid, req.params.type],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/freereservations/:dockid/:year([1-9][0-9][0-9][0-9])-:month(1[0-2]|0[1-9])-:day(0[1-9]|[1-2][0-9]|3[0-1])', function (req, res) {

    let date = req.params.year + "-" + req.params.month + "-" + req.params.day;

    res.locals.connection.query('SELECT capacity-COUNT(resID) AS `freeReservations`, capacity FROM `Reservation`, `Dock` WHERE ' +
        '`pickupDock` = `dockID` AND `dockID` = ? AND (`timeFrom` >= ? AND `timeFrom` <= (? + INTERVAL 1 DAY)) AND (status="active" or status="reserved")', [req.params.dockid, date, date],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/defective/:dockid', function (req, res) {
    res.locals.connection.query('SELECT COUNT(Bike.bikeID) as defectiveBikes FROM Bike, Dock WHERE Bike.dock = Dock.dockID AND Bike.usable = "no" AND Dock.dockID = ?', [req.params.dockid], function (error, results, fields) {
        if (error) {
            res.status(500).json({status: 500, error: error, response: null});
        } else {

            res.status(200).json({status: 200, error: error, response: results});
        }
        res.locals.connection.end();
    })
});

router.get('/gear/', function(req, res) {


});

router.get('/overview/:dockid', function (req, res) {

    let overviewDetails = {};
    // Get bike types and count
    res.locals.connection.query('SELECT Bike.type AS \'type\', count(*) as \'count\'\n' +
        'FROM Dock, Bike WHERE Dock.dockID = Bike.dock AND Dock.dockID = ?\n' +
        'GROUP BY Bike.type', [req.params.dockid], function (error, results1, fields) {
        if (error) {
            res.json({"status": 500, "error": error, "response": null});
        } else {
            //res.json({"status": 200, "error": null, "response": results});


            // Get bike types and count
            res.locals.connection.query('SELECT Bike.type AS \'Free type:\', count(*)\n' +
                'FROM Dock, Bike WHERE Dock.dockID = Bike.dock AND Dock.dockID = ? AND NOT EXISTS (SELECT bikeID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` < (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved"))\n' +
                '     \n' +
                'GROUP BY Bike.type', [req.params.dockid], function (error, results2, fields) {
                if (error) {
                    res.json({"status": 500, "error": error, "response": null});
                } else {
                    //res.json({"status": 200, "error": null, "response": results});


                    //

                    res.locals.connection.query('SELECT COUNT(bikeID) AS `freeBikes`, capacity FROM `Bike`, `Dock` WHERE ' +
                        '`dock` = `dockID` AND `dock` = ? AND NOT EXISTS (SELECT bikeID FROM `Reservation` WHERE (`timeFrom` >= CURDATE() AND `timeFrom` < (CURDATE() + INTERVAL 1 DAY)) AND (status="active" OR status="reserved"))', [req.params.dockid],
                        function (error, results3, fields) {
                            if (error) {
                                res.json({"status": 500, "error": error, "response": null});
                            } else {

                                overviewDetails = Object.assign(overviewDetails, {results1, results2, results3});
                                res.json({"status": 200, "error": null, "response": overviewDetails});
                            }
                            res.locals.connection.end();
                        });
                }
            });
        }
    });
});

module.exports = router;

