var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(301).redirect("docs.html");
  console.log("redirect user to docs.html for docs");
});

module.exports = router;
