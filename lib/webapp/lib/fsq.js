var fs = require('fs'),
    q = require('q'),
    fsq = module.exports = {};

fsq.exists = function(path) {
    var d = q.defer();

    fs.exists(path, function(exists) {
        if(exists === true) {
            d.resolve(true)
        } else {
            d.reject(false)
        }
    });

    return d.promise;
};

fsq.readFile = function(path) {
    var d = q.defer();

    fs.readFile(path, function(err, content) {
        if(!err && content) {
            d.resolve(content)
        } else {
            d.reject(err)
        }
    });

    return d.promise;
};

fsq.readDir = function(path) {
    var d = q.defer();

    fs.readdir(path, function(err, files) {
        if(!err && files) {
            d.resolve(files)
        } else {
            d.reject(err)
        }
    });

    return d.promise;
};

//fsq.walk = function(path) {
//    var d = q.defer();
//
//    fsq.readDir(path)
//        .then(function(files) {
//            var count = files.length,
//                results = [];
//
//            if(count == 0) {
//                d.resolve(files);
//            } else {
//                files.forEach(function(file) {
//                    file = path + '/' + file;
//
//                    fs.stat(file, function(err, stat) {
//                        if (stat && stat.isDirectory()) {
//                            walk(file, function(err, res) {
//                                results = results.concat(res);
//                                if (!--pending) done(null, results);
//                            });
//                        } else {
//                            results.push(file);
//                            if (!--pending) done(null, results);
//                        }
//                    });
//                })
//            }
//        })
//        .catch(function(err) {
//            d.reject(err)
//        });
//
//    fs.readdir(path, function(err, list) {
//        if (err) return done(err);
//        var pending = list.length;
//        if (!pending) return done(null, results);
//        list.forEach(function(file) {
//            file = dir + '/' + file;
//            fs.stat(file, function(err, stat) {
//                if (stat && stat.isDirectory()) {
//                    walk(file, function(err, res) {
//                        results = results.concat(res);
//                        if (!--pending) done(null, results);
//                    });
//                } else {
//                    results.push(file);
//                    if (!--pending) done(null, results);
//                }
//            });
//        });
//    });
//
//    return d.promise;
//};