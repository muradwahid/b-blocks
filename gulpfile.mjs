import gulp from 'gulp';
import zip from 'gulp-zip';
import { deleteAsync } from 'del';
import fsDeploy from 'gulp-freemius-deploy';
import browserSync from 'browser-sync';

gulp.task('browser-sync', () => {
	browserSync.init({
		proxy: 'localhost/development'
	});
	gulp.watch(['src/*.js', 'src/*.scss']).on('change', () => browserSync.reload());
});

gulp.task('clean', async () => await deleteAsync(['languages', 'bundled']));

export const bundle = () => gulp.src([
	'**/*',
	'!bundled/**',
	'!node_modules/**',
	'!src/**',
	'!.eslintrc.js',
	'!.gitignore',
	'!gulpfile.mjs',
	'!package.json',
	'!package-lock.json',
	'!readme.md',
	'!todo.txt',
	'!webpack.config.js',
]).pipe(
	zip('b-blocks.zip')
).pipe(
	gulp.dest('bundled')
);

fsDeploy(gulp, {
	developer_id: 17369,
	plugin_id: 12845,
	public_key: 'pk_07bd754f0bd3ca5ab633d7547e273',
	secret_key: 'sk_Y~R_&Lj}ys12Lg<$aWPzLYN4ewFPT',
	zip_name: 'b-blocks.zip',
	zip_path: 'bundled/',
	add_contributor: false,
});