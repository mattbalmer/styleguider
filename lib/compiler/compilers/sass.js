var path = require('path'),
    fs = require('fs'),
    config = require('./../config'),
    sass = require('node-sass');

module.exports = {
    extension: 'sass',
    compile: function compile(sassContent, options, done) {
        var srcPath = path.join(config('cwd'), config('styleDir'));

        sass.render({
            data: sassContent,
            indentedSyntax: true,
            includePaths: [ srcPath ].concat(options.paths),
            success: function(cssContent) {
                var destPath = path.join(config('cwd'), 'styleguide.css');
                fs.writeFileSync(destPath, cssContent);
                done();
            },
            error: function(error) {
                throw error;
            }
        });
    }
};