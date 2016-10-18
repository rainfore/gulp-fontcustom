'use strict';

module.exports = function(method) {
    return function() {
        const args = Array.prototype.slice.call(arguments);
        return new Promise((resolve, reject) => {
            args.push((err, ret) => err ? reject(err) : resolve(ret));
            method.apply(null, args);
        });
    }
}
