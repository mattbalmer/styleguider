var styleguider = module.exports = function(cwd) {
    if(cwd) {
        styleguider.config({ cwd: cwd });
        styleguider.config.fromPkg();
    }
    return styleguider;
};

styleguider.config = require('./config');

styleguider.webapp = require('./webapp');
styleguider.compiler = require('./compiler');
styleguider.compile = styleguider.compiler.build;

styleguider.config('__sgdir', __dirname);