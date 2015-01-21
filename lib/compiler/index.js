var sgCompiler = module.exports = {},
    config = require('./config');
config('__compilerdir', __dirname);

sgCompiler.build = require('./build');
sgCompiler.dependencies = require('./dependencies');
