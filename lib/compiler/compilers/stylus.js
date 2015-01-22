var path = require('path'),
    fs = require('fs'),
    config = require('./../config'),
    stylus = require('stylus'),
    nib = require('nib');

module.exports = {
    extension: 'styl',
    compile: function compile(stylusContent, options, done) {
        var srcPath = path.join(config('cwd'), config('styleDir'));

        stylus(stylusContent)
            .set('filename', config('destName')+'.css' )
            .set('paths', [ srcPath ].concat(options.paths))
            .use(nib)
            .include('nib')
            .render(function(err, cssContent) {
                if(err) throw err;

                var destPath = path.join(config('cwd'), config('destDir'), config('destName')+'.css' );
                fs.writeFileSync(destPath, cssContent);
                done();
            });
    }
};