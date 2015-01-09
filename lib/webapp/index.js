var sgWebapp = module.exports = {},
    config = require('./lib/config');
config('__webappdir', __dirname);

sgWebapp.start = require('./lib/start');

