var path = require('path'),
    express = require('express'),
    router = require('./router'),
    config = require('./config');

function createApp() {
    var app = express();

    app.set('views', path.join(config('__webappdir'), 'views'));
    app.set('view engine', 'jade');

    app.locals.pretty = true;
    app.locals.basedir = config('cwd');

    // Add all config options to locals
    app.locals.config = config();

    router(app);

    return app;
}

module.exports = function(port) {
    port = port || config('defaultPort');

    var app = createApp();

    app.listen(port, function() {
        console.log('Styleguider Webapp listening on port %d', port);
    })
};