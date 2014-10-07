module.exports = function(grunt) {

  // 1. All configuration goes here
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      concat: {
        // 2. Configuration for concatinating files goes here.
        css: {
          src: [
            'style/typography.css',
            'animation/*.css',
            'components/*.css',
            'layout/*.css',
            'style/*.css',
            'libs/*.css'
          ],
          dest: 'materializer.min.css'
        },
        js: {
          src: [
            'animation/*.js',
            'components/*.js',
            'layout/*.js',
            'style/*.js',
            'libs/*.js'
          ],
          dest: 'materializer.min.js'
        }
      },
      autoprefixer: {
        options: {
          browsers: ["last 2 versions", "ie 9", "iOS 6", "Safari 6.2", "ChromeAndroid 25", "FirefoxAndroid 20", 'opera 12', 'ff 15', 'chrome 25']
        },
        single_file: {
          src: 'materializer.min.css',
          dest: 'materializer.min.css'
        }
      },
      cssmin: {
        minify: {
          src: 'materializer.min.css',
          dest: 'materializer.min.css'
        }
      },
      uglify: {
        build: {
          src: 'materializer.min.js',
          dest: 'materializer.min.js'
        }
      }
  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['concat',"autoprefixer",'cssmin','uglify']);

};