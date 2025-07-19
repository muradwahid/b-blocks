import gulp from 'gulp';
import { deleteAsync } from 'del';
import fsDeploy from 'gulp-freemius-deploy';

gulp.task('clean', async () => await deleteAsync(['b-blocks.zip', 'languages/*']));

fsDeploy(gulp, {
	developer_id: 17369,
	plugin_id: 12845,
	public_key: 'pk_07bd754f0bd3ca5ab633d7547e273',
	secret_key: 'sk_Y~R_&Lj}ys12Lg<$aWPzLYN4ewFPT',
	zip_name: 'b-blocks.zip',
	zip_path: 'bundled/',
	add_contributor: false,
});