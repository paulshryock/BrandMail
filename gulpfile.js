const Eleventy = require('@11ty/eleventy')
const ssg = new Eleventy()
const del = require('del')
const gulp = require('gulp')
const beautify = require('gulp-beautify')
const connect = require('gulp-connect')
const htmlmin = require('gulp-htmlmin')
const rename = require('gulp-rename')

const isProduction = process.env.NODE_ENV === 'production' ? true : false

const paths = {
  src: '.src/**/*',
  html: {
    src: './src/*.html',
    dest: './build',
    output: './build/**/*.html'
  },
  fonts: {
    src: './src/_assets/fonts/**/*',
    dest: './build/fonts'
  },
  images: {
    src: './src/_assets/img/**/*',
    dest: './build/img'
  }
}

function clean () {
  return del([paths.html.dest])
}

async function buildHtml (cb) {
  await ssg.init()
  if (!isProduction) {
    await ssg.watch() // Run Eleventy and watch for changes
  } else {
  await ssg.write() // Run Eleventy
  }

  gulp.src(paths.html.output)
    .pipe(beautify.html({ indent_size: 2 })) // Beautify
    .pipe(gulp.dest(paths.html.dest))
    .pipe(connect.reload())

  return cb()
}

function minifyHtml (cb) {
  gulp.src(paths.html.output)
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      processConditionalComments: true
    })) // Minify
    .pipe(gulp.dest(paths.html.dest))
    .pipe(connect.reload())

  return cb()
}

function fontsBundle () {
  const bundle = gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest)) // Copy fonts
    .pipe(connect.reload())

  return bundle
}

function imagesBundle () {
  const bundle = gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest)) // Copy images
    .pipe(connect.reload())

  return bundle
}

function serve () {
  connect.server({
    root: paths.html.dest,
    livereload: true
  })
}

function watch () {
  gulp.watch([paths.src], buildHtml)
}

/**
 * Gulp tasks
 */

exports.default = gulp.series(
  clean,
  gulp.parallel(buildHtml, fontsBundle, imagesBundle),
  minifyHtml
)

exports.build = gulp.series(
  clean,
  gulp.parallel(buildHtml, fontsBundle, imagesBundle),
  minifyHtml
)

exports.develop = gulp.series(
  clean,
  gulp.parallel(buildHtml, fontsBundle, imagesBundle)
)

exports.serve = gulp.series(
  clean,
  gulp.parallel(buildHtml, fontsBundle, imagesBundle),
  gulp.parallel(serve, watch)
)
