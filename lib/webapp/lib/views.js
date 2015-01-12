var views = module.exports = {},
    config = require('./config'),
    jade = require('jade'),
    fsq = require('./fsq'),
    fs = require('fs'),
    path = require('path'),
    highlight = require('highlight.js'),
    q = require('q');

views.includes = [
    'mixins.jade'
];

views.renderStatic = function(filename) {
    var d = q.defer();

    fsq.readFile( path.join(config('cwd'), config('staticDir'), filename) )
        .then(function(raw) {
            for(var i = 0; i < views.includes.length; i++) {
                var incPath = path.join(config('pathToLib'), 'lib', views.includes[i]);
                raw = "include "+incPath+"\n" + raw;
            }

            var content = jade.render(raw, {
                filename: path,
                pretty: true
            });

            d.resolve(content);
        })
        .catch(function(err) {
            d.reject(err);
        });

    return d.promise;
};

views.makeDemo = function(filepath) {
    var d = q.defer(),
        demo = {},
        filename = path.basename(filepath);
    filename = filename.substring(0, filename.lastIndexOf('.'));

    demo.id = filename;
    demo.name = filename.replace(/\-/g, ' ');

    fsq.readFile(filepath)
        .then(function(raw) {
            var html = {};

            for(var i = 0; i < views.includes.length; i++) {
                var incPath = path.join(config('pathToLib'), 'lib', views.includes[i]);
                raw = "include "+incPath+"\n" + raw;
            }

            html.raw = jade.render(raw, {
//                basedir: __dirname + '/views',
                filename: path,
                pretty: true
            });

            html.highlighted = highlight.highlight('html', html.raw).value;

            html.raw = html.raw.replace(/(<\/.*>)/g, "$1<br>");
            html.raw = html.raw.replace(/(<.*\/>)/g, "$1<br>");
            html.highlighted = html.highlighted.replace(/(&lt;\/.*?&gt;)/g, "$1\n");

            html.raw = html.raw.replace(/\\cn/g, '<br/>');
            html.highlighted = html.highlighted.replace(/\\cn/g, '');

            html.raw = html.raw.replace(/\\dn/g, '');
            html.highlighted = html.highlighted.replace(/\\dn/g, '\n');

            html.raw = html.raw.replace(/\\n/g, '<br/>');
            html.highlighted = html.highlighted.replace(/\\n/g, '\n');

            demo.html = html;
            demo.stacked = false;

            d.resolve(demo);
        })
        .catch(function(err) {
            d.reject(err);
        });

    return d.promise;
};

views.makeInstance = function(instancePath) {
    var d = q.defer(),
        instance = {},
        instanceName = path.basename(instancePath);

    instance.id = instanceName;
    instance.name = instanceName.replace(/\-/g, ' ');

    fsq.readDir( instancePath )
        .then(function(files) {
            files = files
                .filter(function(filename) {
                    return filename.indexOf('.jade') > -1;
                })
                .map(function(filename) {
                    return path.join(instancePath, filename);
                })
                .map(views.makeDemo);

            return q.all(files)
        })
        .then(function(demos) {
            instance.demos = demos;
            d.resolve(instance);
        })
        .catch(function(err) {
            d.reject(err);
        });

    return d.promise;
};

views.makeLevel = function(level) {
    var d = q.defer(),
        levelPath = path.join(config('cwd'), config('viewDir'), level);

    fsq.readDir( levelPath )
        .then(function(instances) {

            instances = instances
                .map(function(instancePath) {
                    return path.join(levelPath, instancePath);
                })
                .filter(function(instancePath) {
                    return fs.lstatSync(instancePath).isDirectory()
                })
                .map(views.makeInstance);

            return q.all(instances);
        })
        .then(function(instances) {
            d.resolve(instances);
        })
        .catch(function(err) {
            if(err.errno == 34)
                d.resolve([]);
            else
                d.reject(err);
        });

    return d.promise;
};