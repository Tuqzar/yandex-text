var gulp = require('gulp'),
    fs = require('fs'),
    $ = require('gulp-load-plugins')({pattern: '*'});
    // destructurization
    const {pug, plumber, sourcemaps, sass, autoprefixer, cssnano, watch, imagemin, browserSync} = $;

var path = {
    // prod: {
    //     root: 'prod/',
    //     html: 'prod/html',
    //     js: 'prod/js/',
    //     sass: 'prod/sass/',
    //     img: 'prod/img/',
    //     fonts: 'prod/fonts/'
    // },
    build: {
        root: 'build',
        html: 'build/',
        js: 'build/js/',
        css: 'build/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    // source: {
    //     root: 'src/',
    //     pug: 'src/pug',
    //     js: 'src/js/',
    //     sass: 'src/sass/',
    //     img: 'src/img/',
    //     fonts: 'src/fonts/'
    // },
    src: {
        pug: ['src/pug/pages/*.pug'],
        js: 'src/js/main.js',
        sass: 'src/sass/style.scss',
        img: 'src/img/**/*.+(png|jpg|gif|svg)',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        pug: ['src/pug/*.pug', 'src/pug/**/*.pug'],
        js: 'src/js/**/*.js',
        sass: ['src/sass/*.scss', 'src/sass/**/*.scss'],
        img: 'src/img/**/*.*',
    },
    clean: './build'
};

gulp.task('pug', function(){
    return gulp.src(path.src.pug)
        .pipe(pug())
        .pipe(plumber())
        .pipe(gulp.dest(path.build.html))
});
gulp.task('sass', function(){
    return gulp.src(path.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        // .pipe(cssnano())
        .pipe(plumber())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css))
});
gulp.task('images', function(){
    return gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
});
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: path.build.html
        }
    });
});

gulp.task('create', create(path.build));
function isExist(dir){
    if(!fs.existsSync(dir))
        return false
    else
        return true
}
function create(dir){
    if(typeof(dir) == 'string'){
        if(!isExist(dir)){
            fs.mkdirSync(dir);
            console.log("Directory created");
        } else {
            console.log("Directory is exist");
        }
    } else {
        for(key in dir){
            if(!isExist(dir[key])){
                fs.mkdirSync(dir[key])
            } else {
                console.log("Directory is exist");
            }
        }
    }
}

gulp.task('serve', ['browser-sync'], function(){
    gulp.watch(path.watch.pug, ['pug', browserSync.reload]);
    gulp.watch(path.watch.sass, ['sass', browserSync.reload]);
    gulp.watch(path.watch.js, ['js', browserSync.reload]);
    gulp.watch(path.watch.img, ['images', browserSync.reload]);
});

