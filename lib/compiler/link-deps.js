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

function linkTo(srcPaths) {
    paths().forEach(function(linkPath, i) {
        var srcPath = srcPaths[i];
        fs.symlinkSync(srcPath, linkPath, 'dir');
    });
}

function linkDependencies(options) {
    options = options || {};
    var deps = options.dependencies || config('dependencies'),
        cwd = options.cwd || config('cwd');

    if(!deps) return;

    var depSrcPaths = deps.map(function(dep) {
        var p = path.join(cwd, 'node_modules', dep);
        var pkg = require( path.join(p, 'package.json') );
        console.log('load dep', dep, p, pkg);

        if(pkg.styleguider.dependencies) {
            console.log('Nested dependencies found', pkg.styleguider.dependencies);
            linkDependencies({
                dependencies: pkg.styleguider.dependencies,
                cwd: p
            })
        }

        return path.join(p, pkg.styleguider.styleDir);
    });

    unlink();
    linkTo(depSrcPaths);
}

module.exports = {
    link: linkDependencies,
    unlink: unlink,
    paths: paths
};