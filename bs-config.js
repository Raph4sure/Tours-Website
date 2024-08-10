module.exports = {
  proxy: 'http://localhost:3000',
  files: ['views/**/*.pug', 'public/**/*.*'],
  port: 3001,
  open: false, // Prevents BrowserSync from opening a new tab
  notify: false, // Disables notifications
  ui: {
    port: 3002
  }
};
