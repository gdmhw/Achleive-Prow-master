var express = require('express');
var router = express.Router();
let authMiddle = require("./auth/authenticate");

/*
#TODO

reservations same day, would be assigned a bike id
res for future days would be bikeid assigned on the day

this still lets the current get avaialabe bike id to work since you only need to know about the bikes the day of, not future bikes



 */



router.get('/', function(req, res, next) {
    res.locals.connection.query('SELECT * FROM `Bike`',
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/id/:bikeid', function(req, res, next) {
    res.locals.connection.query('SELECT * FROM `Bike` WHERE `bikeID` = ?', [req.params.bikeid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/type/:type', function(req, res, next) {
    if (req.params.type == undefined || (req.params.type != "mountain" && req.params.type != "standard" && req.params.type != "road")) {
        return res.json({"status": 500, "error": {code:500, message:"Field type is not valid"}, "response": null});
    }


    res.locals.connection.query('SELECT * FROM `Bike` WHERE `type` = ?', [req.params.type],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.get('/id/:bikeid/faults', function(req, res, next) {
    res.locals.connection.query('SELECT * FROM `Fault` WHERE `bikeID` = ?', [req.params.bikeid],
        function (error, results, fields) {
            if (error) {
                res.json({"status": 500, "error": error, "response": null});
            } else {
                res.json({"status": 200, "error": null, "response": results});
            }
            res.locals.connection.end();
        });
});

router.post('/id/:bikeid/faults/create', function(req, res, next) {

    //validate the data
    if (req.body.userNotes == undefined || req.body.userNotes == "" || req.body.userNotes.length > 2000) {
        return res.status(400).json({
            "status": 400,
            "error": {"message": "Field 'userNotes' is not valid"},
            "response": null
        });
    }

    let insertData = {
            bikeID: req.params.bikeid,
            completed: "no",
            userNotes: req.body.userNotes,
            //createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

    res.locals.connection.query("INSERT INTO `Fault` SET ?",
        insertData, function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                var info = {
                    "faultID": results.insertId,
                    "affectedRows": results.affectedRows,
                    "message": "Successfully logged fault with maintenance"
                };

                res.status(201).json({"status": 201, "error": null, "response": info});
            }
            res.locals.connection.end();
        });


});

router.post(['/faults/:faultid/modify', '/id/:bikeid/faults/:faultid/modify'], function(req, res, next) {
//TODO should be a transaction no?
    res.locals.connection.query("SELECT completed, userNotes FROM Fault WHERE faultID = ?",
        [req.params.faultID], function (error, results, fields) {
            if (error) {
                res.status(500);
                res.json({"status": 500, "error": error, "response": null});
            } else {
                if (results.length <= 0) {
                    res.status(400).json({"status": 400, "error": null, "response": {message:"No faults detected with that faultID"}});
                }

                let updateInfo = {
                    completed: req.body.completed,
                    userNotes: req.body.userNotes
                };

                //validate the data
                if (req.body.userNotes == undefined || req.body.userNotes == "" || req.body.userNotes.length > 2000) {
                    updateInfo.completed = results[0].completed;
                    // return res.status(400).json({
                    //     "status": 400,
                    //     "error": {"message": "Field 'userNotes' is not valid"},
                    //     "response": null
                    // });
                }

                if (req.body.completed == undefined || req.body.completed == "" || req.body.completed != "yes" || req.body.completed != "no") {
                    updateInfo.userNotes = results[0].userNotes;
                    // return res.status(400).json({
                    //     "status": 400,
                    //     "error": {"message": "Field 'completed' is not valid"},
                    //     "response": null
                    // });
                }


                res.locals.connection.query("UPDATE `Fault` SET completed = ?, userNotes = ? WHERE bikeID = ?",
                    [updateInfo.completed, updateInfo.userNotes, updateInfo.bikeID], function (error, results, fields) {
                        if (error) {
                            res.status(500);
                            res.json({"status": 500, "error": error, "response": null});
                        } else {
                            var info = {
                                "faultID": results.insertId,
                                "affectedRows": results.affectedRows,
                                "message": "Successfully logged fault with maintenance"
                            };

                            res.status(201).json({"status": 201, "error": null, "response": info});

                            res.locals.connection.end();
                        }
                    });
            }
        });

});

module.exports = router;
