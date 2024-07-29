// const browserSync = require('browser-sync').create();
// const path = require('path');
// const publicDirectory = path.join(__dirname, 'public');

// browserSync.init({
//   proxy: 'http://localhost:3000',
//   files: ['views/**/*.pug', 'public/**/*.*'],
//   ignore: ['node_modules'],
//   reloadDelay: 500,
//   notify: false,
//   logLevel: 'debug' // Enable debug logging
// });


const browserSync = require('browser-sync').create();
const nodemon = require('nodemon');

nodemon({
  script: 'server.js',
  ext: 'js json pug',
  ignore: ['node_modules/', 'public/']
}).on('start', () => {
  if (!browserSync.active) {
    browserSync.init({
      proxy: 'http://localhost:3000',
      files: ['public/**/*.*', 'views/**/*.*'],
      port: 5000,
      notify: false
    });
  }
});

nodemon.on('quit', () => {
  browserSync.exit();
});