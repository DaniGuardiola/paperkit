module.exports = function(grunt) {

  // 1. All configuration goes here
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      
      compiler: {
        css: {
          expand: true,
          src: [
            'source/animation/*.json',
            'source/components/*.json',
            'source/layout/*.json',
            'source/style/*.json',
            'source/libs/*.json'
          ],
          dest: 'bin/',
          ext: '.css',
          rename: function(dest, src) {            
            var newDest = dest + src.replace("source", "materializer");
            // console.log("DEST => " + dest + " SRC => " + src + " NEW => " + newDest);
            return newDest;
          }
        }
      },
      concat: {
        // 2. Configuration for concatinating files goes here.
        css: {
          src: [
            'bin/materializer/animation/*.css',
            'bin/materializer/components/*.css',
            'bin/materializer/layout/*.css',
            'bin/materializer/style/*.css',
            'bin/materializer/libs/*.css'
          ],
          dest: 'bin/materializer.css'
        },
        js: {
          src: [
            'bin/animation/*.js',
            'bin/components/*.js',
            'bin/layout/*.js',
            'bin/style/*.js',
            'bin/libs/*.js'
          ],
          dest: 'bin/materializer.js'
        }
      },
      autoprefixer: {
        options: {
          browsers: ["last 2 versions", "ie 9", "iOS 6", "Safari 6.2", "ChromeAndroid 25", "FirefoxAndroid 20", 'opera 12', 'ff 15', 'chrome 25']
        },
        single_file: {
          src: 'bin/materializer.css',
          dest: 'bin/materializer.css'
        }
      },
      cssmin: {
        minify: {
          src: 'bin/materializer.css',
          dest: 'bin/materializer.min.css'
        }
      },
      uglify: {
        build: {
          src: 'bin/materializer.js',
          dest: 'bin/materializer.min.js'
        }
      }      
  });

  grunt.loadTasks('tasks');
  grunt.loadTasks('tasks/grunt-materializer-compiler');

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['compiler','concat',"autoprefixer",'cssmin','uglify']);

};
