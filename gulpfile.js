// *****************************************************
// ***** Данная конфигурация написана для GULP 4.0 *****
// ***************************************************** 

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssMin = require('gulp-csso'),
    rename = require('gulp-rename'),
    BS = require('browser-sync').create();

// style.sass
function myScssCompiler() {
    return gulp.src('./assets/scss/**/*.scss') // откуда
                // вместо concat-sass добавил '_' underscore к имени файлов в папке blocks , с ним файлы не компелируются, т.е. sass() их не затрагивает, все тянется из main.scss
                .pipe(sass()) // Преобразуем в CSS
                .pipe(gulp.dest('./assets/css')) // Сохраняем dev версию, потом опять берем
                .pipe(cssMin()) // Минификация JS
                .pipe(rename({suffix: '.min'})) // Так делают все норм библ-ки, добав суффикс .min. 
                .pipe(gulp.dest('./assets/css')); // Сохраняем min версию 
}

function mapping() {
    return gulp.src('./assets/scss/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./assets/css'));
}

function mappingMin() {
     return gulp.src('./assets/scss/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))

            .pipe(cssMin())
            .pipe(rename({suffix: '.min'}))
            
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./assets/css'));
}


// bootstrap.sass
// function bootstrapSassCompile() {
//     return gulp.src('./assets/bootstrap-4.3.1/scss/bootstrap.scss') // откуда
//                 // вместо concat-sass добавил '_' underscore к имени файлов в папке blocks , с ним файлы не компелируются, т.е. sass() их не затрагивает, все тянется из main.scss
//                 .pipe(sass()) // Преобразуем в CSS
//                 .pipe(gulp.dest('./assets/bootstrap-4.3.1/dist/css'))
// }

// Автоперезапуск вкладки, task для севрвера
function server() {
    BS.init({
        server: {
                baseDir: './'
        }
    });

    // В одной строке отслеживаем все изменения который повлекут перезагрузку страницы
    BS.watch('./**/*.*').on('change', function() {
        BS.reload({stream: false});
    }); 
}

// watch
function watchFiles() {
    // gulp.watch(['./*.html'], html);
    gulp.watch('./assets/scss/*.sass', myScssCompiler);
}

// Вместо task default делаем экспорт модулей, чтобы gulp увидел методы 
// exports.html = html;
exports.myScssCompiler = myScssCompiler;
exports.mapping = mapping;
exports.mappingMin = mappingMin;
// exports.clear = clear;
exports.watchFiles = watchFiles;
exports.server = server;

exports.default = gulp.parallel(myScssCompiler, mapping, mappingMin, watchFiles, server); // exports.clear = clear - убрал из списка так как удаляет JSON папку
