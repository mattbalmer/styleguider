var path = require('path'),
    fs = require('fs'),
    dependencies = require('./dependencies'),
    config = require('./config');

module.exports = function() {
    console.log('Styleguider : building %s (%s)', config('name'), config('language') );

    var compilerPath = './compilers/' + config('language').toLowerCase();
    var compiler = require(compilerPath);

    var filePath = path.join(config('cwd'), config('styleDir'), 'index.'+compiler.extension );
    var content = fs.readFileSync(filePath, 'utf8');

    dependencies.link();

    compiler.compile(content, {
        paths: [ config('styleDir') ]
    }, function() {
        dependencies.unlink()
    });
};