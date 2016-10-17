const path = require('path');
const gulp = require('gulp');
const fontcustom = require('../index.js');

gulp.task('test', (done) => {
    return gulp.src('./fixtures/*')
        .pipe(fontcustom({
            templates: 'preview ./fontcustom.css',
            preprocessor_path: '../fonts',
        }, {
            verbose: true,
        }))
        .pipe(gulp.dest('./results'));
});
