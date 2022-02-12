const gulp = require('gulp');
const zip = require('gulp-zip');

const folder = () => (
	gulp.src([
		'**/*',
		'!bundled/**',
		'!node_modules/**',
		'!src/**',
		'!.eslintrc.js',
		'!.gitignore',
		'!gulpfile.js',
		'!pending.txt',
		'!package.json',
		'!package-lock.json',
		'!readme.md',
		'!webpack.config.js',
	])
		.pipe(gulp.dest('bundled/b-blocks'))
);

const folderZip = () => (
	gulp.src([
		'bundled/**',
		'!bundled/*.zip'
	])
		.pipe(zip('b-blocks.zip'))
		.pipe(gulp.dest('bundled'))
);

exports.bundle = gulp.series(folder, folderZip);