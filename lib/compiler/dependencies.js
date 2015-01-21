var path = require('path'),
    fs = require('fs'),
    config = require('./config');

function link(tree) {
    console.log('linking', tree);
    tree.dependencies.forEach(link);
    //console.log('%s -> %s', styleguide)
}

function sgpkg(cwd) {
    var pkg = require( path.join(cwd, 'package.json') );
    var result = pkg.styleguider;
    result.name = result.name || pkg.name;
    result.version = result.version || pkg.version;
    return result;
}

function tree(cfg) {
    cfg = cfg || {};
    var cwd = cfg.cwd || config('cwd'),
        pkg = sgpkg(cwd),
        result = {
            name: pkg.name,
            path: cwd,
            dependencies: pkg.dependencies || []
        };

    result.dependencies = result.dependencies.map(function(dependency) {
        var p = path.join(cwd, 'node_modules', dependency);
        return tree({ cwd: p });
    });

    return result;
}

module.exports = {
    tree: tree,
    link: function() {
        link(tree());
    }
};