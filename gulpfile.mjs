import { deleteAsync } from 'del';
import gulp from 'gulp';
import fsDeploy from 'gulp-freemius-deploy';

gulp.task('clean', async () => await deleteAsync(['b-blocks.zip', 'build/*', 'languages/*']));

fsDeploy(gulp, {
	developer_id: process.env.DEV_ID,
	plugin_id: process.env.P_ID,
	public_key: process.env.PK,
	secret_key: process.env.SK,
	zip_name: 'b-blocks.zip',
	zip_path: '/',
	add_contributor: false
});