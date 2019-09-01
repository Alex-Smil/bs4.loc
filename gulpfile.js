// *****************************************************
// ***** Данная конфигурация написана для GULP 4.0 *****
// ***************************************************** 

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssMin = require('gulp-csso'),
    cleancss     = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    notify       = require('gulp-notify'),
    rename = require('gulp-rename'),
    BS = require('browser-sync').create();

// style.sass
function myScssCompiler() {
    return gulp.src('./assets/scss/**/*.scss') // откуда
                .pipe(sourcemaps.init()) // инициализируем создание Source Maps
                //.pipe(sass().on("error", notify.onError())) // компилируем файл .css
                //.pipe(gulp.dest('./assets/css'))
                //.pipe(cssMin())
                .pipe(sass({ outputStyle: 'compressed' }).on("error", notify.onError())) // компилируем сжатый файл .css
                .pipe(rename({ suffix: '.min', prefix : '' })) // переименовываем файл в .min.css
                .pipe(autoprefixer(['last 15 versions'])) // добавляем вендорные префиксы
                .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // удаляем все комментарии из кода
                .pipe(sourcemaps.write('./')) // пути для записи SourceMaps - в данном случае карта SourceMaps будет добавлена прям в данный файл main.min.css в самом конце
                .pipe(gulp.dest('./assets/css')); // перемещение скомпилированного файла main.min.css в папку app/css
}

// function mapping() {
//     return gulp.src('./assets/scss/**/*.scss')
//             .pipe(sourcemaps.init())
//             .pipe(sass().on('error', sass.logError))
//             .pipe(sourcemaps.write('./'))
//             .pipe(gulp.dest('./assets/css'));
// }

// function mappingMin() {
//      return gulp.src('./assets/scss/**/*.scss')
//             .pipe(sourcemaps.init())
//             .pipe(sass().on('error', sass.logError))
//             .pipe(cssMin())
//             .pipe(rename({suffix: '.min'}))
//             .pipe(sourcemaps.write('./'))
//             .pipe(gulp.dest('./assets/css'));
// }


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
    gulp.watch('./assets/scss/*.scss', myScssCompiler);
}

// Вместо task default делаем экспорт модулей, чтобы gulp увидел методы 
// exports.html = html;
exports.myScssCompiler = myScssCompiler;
// exports.mapping = mapping;
// exports.mappingMin = mappingMin;
// exports.clear = clear;
exports.watchFiles = watchFiles;
exports.server = server;

exports.default = gulp.parallel(myScssCompiler, watchFiles, server); // exports.clear = clear - убрал из списка так как удаляет JSON папку
