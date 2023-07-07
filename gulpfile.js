/*
* The Gulp APIs and plugins used in this file are only briefly explained. For a full explanation, you can check their respective
* documentations as specified below
*
* src(): https://gulpjs.com/docs/en/api/src
* dest(): https://gulpjs.com/docs/en/api/dest
* watch(): https://gulpjs.com/docs/en/api/watch
* gulp-sass: https://github.com/dlmanning/gulp-sass#readme
* gulp-uglify: https://github.com/terinjokes/gulp-uglify/#readme
* gulp-rename: https://github.com/hparra/gulp-rename#readme
* */

/*
* Open the Gulp project folder in the command line, that is the folder containing the package.json file and
* run the commands below to install the 'gulp-sass', 'gulp-uglify' 'gulp-rename' Gulp plugins and the 'sass' npm package
*
* Install gulp-sass and sass: npm install sass gulp-sass --save-dev
* Install gulp-uglify: npm install --save-dev gulp-uglify
* Install gulp-rename: npm install --save-dev gulp-rename
*
* Note: These plugins must be installed before they can be imported as shown below.
* */

const { src, dest, watch } = require('gulp'); // Imports the src, dest and watch APIs from the gulp module. Explanation on their usage will be given below.
const sass = require('gulp-sass')(require('sass')); // Imports the gulp-plugin for sass and the Dart Sass compiler for compiling and compressing your .scss files to .css files
const uglify = require('gulp-uglify'); // Imports the gulp-uglify plugin for minifying your JS files
const rename = require('gulp-rename'); // Imports the gulp-rename plugin to be used for renaming files.

/* Note: Replace custom_extension with the name of your extension. That is the your extension's extension key. */

// Specify the pattern or patterns of the JS files you want to minify
const jsPartialFiles = [
    '../packages/custom_extension/Resources/Public/JavaScript/JsPartials/**/_*.js',
];

// Specify the pattern or patterns of the SCSS files you want to compile and minify to CSS files
const scssFiles = [
    '../packages/custom_extension/Resources/Public/Scss/**/*.scss',
    '../packages/custom_extension/Resources/Public/Scss/**/*-final.scss'
];

// Task to compile and minify SCSS files
function compileAndMinifyCss() {
    return src(scssFiles) // src() is used to fetch all files matching a pattern or array of patterns so they can operated on
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // the sass imported above is used to compile and compress the files fetched by src().
        .pipe(dest('../packages/custom_extension/Resources/Public/Css/')); // dest() is given a directory to which it writes the compiled and compressed CSS files to.
}

// Task to minify JS files
function minifyJsPartials() {
    return src(jsPartialFiles) // src() used to fetch the JS files
        .pipe(uglify()) // uglify() is used to minify the JS files fetched by src()
        .pipe(rename({ extname: '.min.js' })) // rename() is used to change the file extension of the minified JS files to .min.js
        .pipe(dest('../packages/custom_extension/Resources/Public/JavaScript/Dist/')); // dest() writes/outputs the minified JS files to a specified directory
}

// Task to watch for changes
function watchTask() {
    watch(scssFiles, {ignoreInitial: false}, compileAndMinifyCss); // watch() watches for changes to files matching any of the patterns in the scssFiles array and then run the 'compileAndMinifyCss' when a change occurs
    watch(jsPartialFiles, {ignoreInitial: false}, minifyJsPartials); // same as above but for the jsPartialFiles array
}


/*
Registers the watchTask() as 'watch' by exporting it from the gulpfile so it can be run by the gulp command in the terminal
So, to run the watchTask() in the terminal, we will use the command 'gulp watch'
 */
exports.watch = watchTask;