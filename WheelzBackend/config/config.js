var fs = require('fs');
var configPath = 'config/config.json';

var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.config =  parsed;