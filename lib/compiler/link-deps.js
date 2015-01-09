var path = require('path'),
    fs = require('fs'),
    config = require('./config');

function paths() {
    var deps = config('dependencies') || [];
    return deps.map(function(dep) {
        return path.join(config('cwd'), config('styleDir'), '@'+dep);
    });
}

function unlink() {
    paths().forEach(function(srcPath) {
        if(fs.existsSync(srcPath))
            fs.unlinkSync(srcPath);
    });
}

function linkTo(destPaths) {
    paths().forEach(function(srcPath, i) {
        var destPath = destPaths[i];
        fs.symlinkSync(destPath, srcPath, 'dir');
    });
}

function linkDependencies() {
    var deps = config('dependencies');

    if(!deps) return;

    var depDestPaths = deps.map(function(dep) {
        var p = path.join(config('cwd'), 'node_modules', dep);
        var pkg = require( path.join(p, 'package.json') );
        return path.join(p, pkg.styleguider.styleDir);
    });

    unlink();
    linkTo(depDestPaths);
}

module.exports = {
    link: linkDependencies,
    unlink: unlink,
    paths: paths
};