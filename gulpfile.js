const gulp = require("gulp");
const { src, dest, watch, series } = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
var browserSync = require('browser-sync').create();
const imagemin = require("gulp-imagemin");

//копіювання HTML файлів в папку dist
const task_html = () => src("app/html/*.html")
  .pipe(dest("dist"));

exports.html = task_html

//об'єднання, компіляція Sass в CSS, додавання префіксів і подальша мінімалізація коду
const task_sass = () => src("app/sass/*.scss")
  .pipe(concat('styles.scss'))
  .pipe(sass())
  .pipe(cssnano())
  .pipe(rename({suffix:'.min'}))
  .pipe(dest("dist/css"));
 
exports.sass = task_sass

//об'єднання і стискання JS-файлів
const task_scripts = () => src("app/js/*.js")//вихідна директорія файлів
  .pipe(concat('scripts.js'))//конкатенація js-файлів в один
  .pipe(uglify())//стиснення коду
  .pipe(rename({suffix:'.min'}))//перейменування файлу з приставкою .min
  .pipe(dest("dist/js"));//директорія продакшена

exports.scripts = task_scripts

//стискання зображень
const task_imgs = () => src("app/img/*.+(jpg|jpeg|png|gif|svg)")
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    interlaced: true
  }))
  .pipe(dest("dist/images"))

  const lib_css_task = () => src('app/lib/css/bootstrap.min.css')
  .pipe(dest('dist/css'));

  const lib_js_task = () => src('app/lib/js/bootstrap.min.js')
  .pipe(dest('dist/js'));

exports.imgs = task_imgs

const task_json = () => src("app/json/data.json")
  .pipe(dest("dist/json"));

exports.json = task_json;

//відстежування за змінами у файлах
const task_watch = () => {
  watch("app/html/*.html",task_html);
  watch("app/js/*.js",task_scripts);
  watch("app/sass/*.scss",task_sass);
  watch("app/images/*.+(jpg|jpeg|png|gif)",task_imgs);

  browserSync.init({
    server: {
        baseDir: "./dist"
    }
});

};
  

exports.watch = task_watch


//запуск тасків за замовчуванням
exports.default = series(
  task_html,
  task_sass,
  task_scripts,
  task_imgs,
  lib_css_task,
  lib_js_task,
  task_json,
  task_watch
  );
