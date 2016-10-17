'use strict';

const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp_fontcustom';
const c2p = require('./lib/callback2promise.js');

const exec = c2p(require('child_process').exec);
const path = require('path');
const fs = {
    mkdir: c2p(require('fs').mkdir),
    rmdir: c2p(require('fs').rmdir),
    readdir: c2p(require('fs').readdir),
    readFile: c2p(require('fs').readFile),
};

module.exports = function (options, opts) {
    const cmd = 'fontcustom compile';
    const defaults = {
        no_hash: true,
        force: true,
    };
    opts = opts || {};

    return through.obj(function (file, enc, cb) {
        const stream = this;

        if (file.isStream())
            return cb(new PluginError(PLUGIN_NAME, 'Streams not supported'));
        if (!file.isDirectory())
            return cb(new PluginError(PLUGIN_NAME, 'Simple file not supported'));
        if (!file.isDirectory() && (file.isNull() || file.path.endsWith('.svg')))
            return cb(null, file);

        const tmp = './___tmp___' + new Date().toJSON().replace(/[^\d]/g, '');

        // Make a tmp directory and use cwd here to keep fontcustom-manifest.json independent.
        fs.mkdir(tmp).then(() => {
            const _options = Object.assign({}, defaults, options);
            _options.output = './';
            _options.font_name = _options.font_name || path.basename(file.path);

            const args = [];
            for(let key in _options)
                args.push('--' + key, _options[key]);

            // fontcustom compile ./input --output ./ [other options]
            const command = [cmd, file.path].concat(args).join(' ');
            opts.verbose && console.log(command);
            return exec(command, { cwd: tmp });
        }).then((stdout) => {
            opts.verbose && console.log(stdout.trim());
            return fs.readdir(tmp);
        }).then((files) => {
            return Promise.all(files.filter((filename) => filename !== '.fontcustom-manifest.json')
                .map((filename) => {
                    const filepath = path.join(tmp, filename);
                    return fs.readFile(filepath).then((contents) => {
                        stream.push(new gutil.File({
                            cwd: file.cwd,
                            base: file.base,
                            path: path.join(file.base, filename),
                            contents,
                        }));
                    });
                }));
        }).then(() => exec('rm -rf ' + tmp))
        .catch((err) => cb(new PluginError(PLUGIN_NAME, err)))
        .then(() => cb());
    });
}
