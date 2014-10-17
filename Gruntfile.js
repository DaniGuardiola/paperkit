module.exports = function(grunt) {

  // Configuration
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // 1 - Cleaning bin and demo
      clean: [
        'bin/',
        'demo/',
        'grunt-materializer/sources/'
        ],

      //cssbeautifier:{files:[    "source/**/*.css"    ]},

      // 2 - Compiling json to css on bin/materializer/
      compiler: {
        css: {
          expand: true,
          src: [
            'source/style/*.json'
          ],
          dest: 'bin/',
          ext: '.css',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source", "materializer");
            return newDest;
          }
        }
      },

      // 3 - Coping everything
      copy: {
        main: {
          expand: true,
          src: [
            'source/class/*',
            'source/css-first/*',
            '!source/**.json'
          ],
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source", "materializer");
            return newDest;
          }
        },
        resources: {
          expand: true,
          src: 'source/md-resources/**',
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source/", "");
            return newDest;
          }
        },
        dev: {
          expand: true,
          src: 'source/**/*.json',
          dest: 'grunt-materializer/sources/',
          flatten: true
        },
        mdcss: {
          src: 'grunt-materializer/**',
          dest: 'bin/'
        }

      },

      // 4 - Autoprefixing all css from bin/materializer/
      autoprefixer: {
        options: {
          browsers: ["last 2 versions", "ie 9", "iOS 6", "Safari 6.2", "ChromeAndroid 25", "FirefoxAndroid 20", 'opera 12', 'ff 15', 'chrome 25']
        },
        prefix: {
          src: [
            'bin/materializer/style/*.css',
            'bin/materializer/class/*.css',
            'bin/materializer/css-first/*.css'
          ]
        }
      },

      // 4 - Beautify everything
      cssbeautifier:{files:[    "bin/materializer/**/*.css"    ]},

      // 5 - Concatenating css and js from bin/materializer/ to bin/
      concat: {
        css: {
          src: [
            'bin/materializer/css-first/*.css',
            'bin/materializer/style/*.css',
            'bin/materializer/class/*.css'
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

      // 6 - Minify css
      cssmin: {
        minify: {
          src: 'bin/materializer.css',
          dest: 'bin/materializer.min.css'
        }
      },

      // 7 - Uglify css
      uglify: {
        build: {
          src: 'bin/materializer.js',
          dest: 'bin/materializer.min.js'
        }
      }
  });


  // Loading our custom tasks
  grunt.loadTasks('tasks');
  grunt.loadTasks('tasks/grunt-materializer-compiler');

  // Loading NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-cssbeautifier');

  // This will run when executing grunt
  grunt.registerTask('default', ['clean','compiler','copy',"autoprefixer",'cssbeautifier','concat','cssmin','uglify']);
  grunt.registerTask('dev', ['copy:dev']);

};
