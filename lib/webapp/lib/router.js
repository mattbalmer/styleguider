var path = require('path'),
    express = require('express'),
    stylus = require('stylus'),
    views = require('./views'),
    config = require('./config');

// === Helpers ===

function capitalize(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

// === Export ===
module.exports = function(app) {
    app.get('/css/styleguide.css', function(req, res) {
        res.sendFile( path.join(config('cwd'), 'styleguide.css') );
    });

    app.get('/authors', function(req, res) {
        views.renderStatic('authors.jade')
            .then(function(content) {
                res.render('page', {
                    path: 'authors',
                    level: 'authors',
                    subtitle: 'This Styleguide shows how to use the pattern library. This page tells you how to write the pattern library',
                    content: content
                });
            })
            .catch(function(err) {
                res.status(500).send(err);
            })
    });

    app.get('/:level', function(req, res) {
        var level = req.param('level');

        views.makeLevel(level)
            .then(function(instances) {

                res.render('page', {
                    path: level,
                    level: level,
                    title: capitalize(level),
                    instances: instances
                });
            })
            .catch(function(err) {
                res.status(500).send(err);
            })

    });

    app.get('/', function(req, res) {
        views.renderStatic('index.jade')
            .then(function(content) {
                res.render('page', {
                    path: '',
                    level: 'index',
                    subtitle: 'v' + config('version') + ' of the ' + config('name') + ' styleguide and pattern library',
                    content: content
                });
            })
            .catch(function(err) {
                res.status(500).send(err);
            })
    });

    app.use(stylus.middleware({
        compress: true,
        src: path.join(config('__webappdir'), 'vendor'),
        compile:  function compile(str, path) {
            return stylus(str)
                .set('filename', path)
                .set('compress', true)
                .use(require('nib')())
                .import('nib');
        }
    }));

    app.use('/vendor', express.static(path.join(config('__webappdir'), 'vendor')));
};