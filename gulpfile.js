var del = require('del'),
	gulp = require('gulp'),
	cache = require('gulp-cache'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	cssnano = require('gulp-cssnano'),
	nodemon = require('gulp-nodemon'),
	imagemin = require('gulp-imagemin'),
	livereload = require('gulp-livereload'),
	autoprefixer = require('gulp-autoprefixer');

// 路径配置参数
var paths = {
	client: {
		rely: {
			scripts: [
				'./public/bower_components/jquery/dist/jquery.min.js',
				'./public/bower_components/bootstrap/dist/js/bootstrap.min.js'
			],
			styles: [
				'./public/bower_components/bootstrap/dist/css/bootstrap.min.css',
				'./public/stylesheets/font-awesome.min.css'
			],
			fonts: ['./public/fonts/**'],
			editor: ['./public/kindEditor/**']
		},
		src: {
			all: './public/**',
			scripts: ['./public/javascripts/style.js'],
			images: ['./public/images/*'],
			styles: ['./public/stylesheets/style-beta.css']
		},
		dest: {
			scripts: './build/script',
			images: './build/image',
			styles: './build/style',
			fonts: './build/fonts/',
			editor: './build/kindEditor/'
		}
	},
	server: {
		index: './bin/www'
	}
};

// 0. 拷贝 js 文件
gulp.task('copy-js', function() {
	return gulp.src(paths.client.rely.scripts)
		.pipe(gulp.dest(paths.client.dest.scripts))
		.pipe(notify({message: 'Copy javascript files complete.'}));
});
// 0. 拷贝 css 文件
gulp.task('copy-css', function() {
	return gulp.src(paths.client.rely.styles)
		.pipe(gulp.dest(paths.client.dest.styles))
		.pipe(notify({message: 'Copy stylesheet files complete.'}));
});
// 0. 拷贝 font 文件
gulp.task('copy-font', function() {
	return gulp.src(paths.client.rely.fonts)
		.pipe(gulp.dest(paths.client.dest.fonts))
		.pipe(notify({message: 'Copy font files complete.'}));
});
// 0. 拷贝 editor 文件
gulp.task('copy-editor', function() {
	return gulp.src(paths.client.rely.editor)
		.pipe(gulp.dest(paths.client.dest.editor))
		.pipe(notify({message: 'Copy editor files complete.'}));
});
// 0. 任务 拷贝文件
gulp.task('copy', ['copy-js', 'copy-css', 'copy-font', 'copy-editor']);

// 脚本代码验证
gulp.task('analysis', function() {
	return gulp.src(paths.client.src.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(notify({message: 'Analysis task complete.'}));
});

// 1. 脚本合并与压缩
gulp.task('scripts', ['analysis'], function() {
	return gulp.src(paths.client.src.scripts)
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.client.dest.scripts))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(paths.client.dest.scripts))
		.pipe(notify({message: 'Scripts task complete.'}));
});

// 2. 资源图片压缩
gulp.task('images', function() {
	return gulp.src(paths.client.src.images)
		// 压缩 imagemin 并缓存 cache 图片
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest(paths.client.dest.images))
		.pipe(notify({message: 'Images task complete.'}));
});

// 3. 样式表的压缩
gulp.task('styles', function() {
	return gulp.src(paths.client.src.styles)
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(paths.client.dest.styles))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(gulp.dest(paths.client.dest.styles))
		.pipe(notify({message: 'Styles task complete.'}));
});

// 清理构建目录
gulp.task('clean', function(cb) {
	// 清空 build 目录
	return del([
			paths.client.dest.scripts, 
			paths.client.dest.images, 
			paths.client.dest.styles,
			paths.client.dest.editor,
			paths.client.dest.fonts
		], cb);
});

// 监听文件变动
gulp.task('watch', function() {
	// 监听文件变动
	gulp.watch(paths.client.src.scripts, ['scripts']);
	gulp.watch(paths.client.src.images, ['images']);
	gulp.watch(paths.client.src.styles, ['styles']);
	// 创建 livereload 监听服务
	livereload.listen();
	// 若有改变自动重载刷新
	gulp.watch([paths.client.src.all]).on('change', livereload.changed);
});

// 自动重启服务端程序
gulp.task('nodemon', function() {
	return nodemon({
		script: paths.server.index,
		ext: 'js',
		env: {'NODE_ENV': 'development'}
	});
});

// 默认任务
gulp.task('default', ['clean'], function() {
	gulp.start(
		'copy',
		'scripts',
		'images',
		'styles',
		'nodemon',
		'watch'
	);
});




