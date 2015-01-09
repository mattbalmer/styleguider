var path = require('path');

// === Public ===
var configFunction = function(config, value) {
    if(typeof config === 'object')
        return setAllConfigs(config);

    if(typeof value !== 'undefined')
        return setConfig(config, value);

    if(typeof config === 'string')
        return getConfig(config);

    return getAllConfigs();
};
configFunction.fromPkg = function() {
    if(!config.cwd) {
        console.log('Cannot read local package.json until cwd is set');
    } else {
        var pkg = require( path.join(config.cwd, 'package.json') );
        if(!pkg.styleguider) {
            console.log('package.json must contain a "styleguider" object');
        } else {
            setConfig('name', pkg.name);
            setConfig('version', pkg.version);
            setAllConfigs(pkg.styleguider);
        }
    }
};

// === Private ===
function getConfig(name) {
    return config[name];
}
function setConfig(k, value) {
    config[k] = value;

    if((k == 'cwd' || k == '__webappdir') && ( config['cwd'] && config['__webappdir']) ) {
        config['pathToLib'] = path.relative(config['cwd'], config['__webappdir']);
    }
}
function getAllConfigs() {
    var cfg = {};

    for(var k in config) {
        if(!config.hasOwnProperty(k)) continue;

        cfg[k] = config[k];
    }

    return cfg;
}
function setAllConfigs(cfg) {
    for(var k in cfg) {
        if(!cfg.hasOwnProperty(k)) continue;

        setConfig(k, cfg[k]);
    }
}

// === Defaults ===
var config = {
    defaultPort: 3000,
    styleDir: '',
    viewDir: '',
    staticDir: '',
    contextRoot: '',
    name: '',
    version: '',
    language: 'stylus',
    levels: [
        'particles',
        'grid',
        'atoms',
        'molecules',
        'organisms',
        'layouts',
        'pages'
    ]
};

// === Export ===
module.exports = configFunction;