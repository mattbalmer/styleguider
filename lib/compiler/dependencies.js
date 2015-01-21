var path = require('path'),
    fs = require('fs'),
    config = require('./config');

function link(tree, parent) {
    console.log('linking', tree);

    tree.dependencies.forEach(function(dependency) {
        link(dependency, tree);
    });

    if(parent) {
        var linkPath = path.join(parent.path, parent.styleDir, '@'+tree.name),
            sourcePath = path.join(tree.path, tree.styleDir);

        fs.symlinkSync(sourcePath, linkPath, 'dir');
    }
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
        pkg = sgpkg(cwd);

    pkg.path = cwd;
    pkg.dependencies = pkg.dependencies || [];

    pkg.dependencies = pkg.dependencies.map(function(dependency) {
        var p = path.join(cwd, 'node_modules', dependency);
        return tree({ cwd: p });
    });

    return pkg;
}

module.exports = {
    tree: tree,
    link: function() {
        link(tree());
    }
};