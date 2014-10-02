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
          dest: 'materializer.css'
        },
        js: {
          src: [
            'animation/*.js',
            'components/*.js',
            'layout/*.js',
            'style/*.js',
            'libs/*.js'
          ],
          dest: 'materializer.js'
        }
      },
      cssmin: {
        minify: {
          src: 'materializer.css',
          dest: 'materializer.min.css'
        }
      },
      uglify: {
        build: {
          src: 'materializer.js',
          dest: 'materializer.min.js'
        }
      }

  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['concat', 'cssmin','uglify']);

};