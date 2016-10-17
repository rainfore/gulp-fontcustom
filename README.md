# gulp-fontcustom

[![NPM version][npm-image]][npm-url]

A gulp plugin that convert SVG files to font icons with Fontcustom

Support multiple async input directories and simple templates

```javascript
// icons/svg1/*.svg, icons/svg2/*.svg
gulp.task('fonticon', (done) => {
    return gulp.src('./icons/*')
        .pipe(fontcustom({
            templates: 'preview ./fontcustom.css',
            preprocessor_path: '../fonts',
        }))
        .pipe(gulp.dest('./results'));
});
```

[npm-url]: https://npmjs.org/package/gulp_fontcustom
[npm-image]: https://img.shields.io/npm/v/gulp_fontcustom.svg
[FontCustom]: https://github.com/FontCustom/fontcustom
