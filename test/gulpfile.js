const gulp = require('gulp');
const fontcustom = require('../index.js');

gulp.task('test', (done) => {
    return gulp.src('./fixtures/*')
        .pipe(fontcustom(null, {
            verbose: true,
        }))
        .pipe(gulp.dest('./results'));
});
