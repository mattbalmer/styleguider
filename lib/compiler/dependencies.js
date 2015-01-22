var path = require('path'),
    fs = require('fs'),
    config = require('./config');

function link(tree, parent) {
    console.log('linking', tree, parent);

    tree.dependencies.forEach(function(dependency) {
        link(dependency, tree);
    });

    if(parent) {
        var linkPath = path.join(parent.path, parent.styleDir, '@'+tree.name),
            sourcePath = path.join(tree.path, tree.styleDir);

        fs.symlinkSync(sourcePath, linkPath, 'dir');
    }
}
function unlink(tree, parent) {
    console.log('unlinking', tree, parent);

    tree.dependencies.forEach(function(dependency) {
        unlink(dependency, tree);
    });

    if(parent) {
        var linkPath = path.join(parent.path, parent.styleDir, '@'+tree.name);

        if(fs.existsSync(linkPath))
            fs.unlinkSync(linkPath);
    }
}

function sgpkg(cwd) {
    var pkgPath = path.join(cwd, 'package.json');
    var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    var result = pkg.styleguider;
    result.name = result.name || pkg.name;
    result.version = result.version || pkg.version;

    console.log('read package json', cwd, pkg);

    return result;
}

function tree(cfg) {
    cfg = cfg || {};
    var cwd = cfg.cwd || config('cwd'),
        pkg = sgpkg(cwd);

    pkg.path = cwd;
    pkg.dependencies = pkg.dependencies || [];

    console.log('tree', pkg);
    pkg.dependencies = pkg.dependencies.map(function(dependency) {
        console.log('adding to tree', cwd, dependency);
        var p = path.join(cwd, 'node_modules', dependency);
        return tree({ cwd: p });
    });

    return pkg;
}

module.exports = {
    tree: tree,
    link: function() {
        link(tree());
    },
    unlink: function() {
        unlink(tree());
    }
};