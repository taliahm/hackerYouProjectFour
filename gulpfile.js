const gulp = require('gulp');
const babel = require('gulp-babel');

const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const concat = require('gulp-concat');



gulp.task('styles', ()=> {
	return gulp.src('./src/styles/**/*.scss')
		.pipe(sass()
		.on('error', notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in CSS 🙈'
			})))
			.pipe(concat('style.css'))
			.pipe(gulp.dest('./public/styles'))
	});

gulp.task('javascript', ()=> {
	return gulp.src('./src/script.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./public/scripts'))
		.pipe(reload({stream: true}))
	});

gulp.task('browserRefresh', ()=> {
	browserSync.init({
		server: '.'
		})
	});

gulp.task('watch', () => {
	gulp.watch('./src/script.js', ['javascript'])
	gulp.watch('./src/styles/**/*.scss', ['styles'])
	gulp.watch('./*.html', reload);
	})

gulp.task('default', ['browserRefresh', 'styles', 'javascript', 'watch'])
