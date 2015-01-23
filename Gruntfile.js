module.exports = function(grunt) {

  // Configuration
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // 1 - Cleaning bin and grunt-materializer/sources/
      clean: [
        'bin/grunt-materializer',
        'bin/materializer',
        'bin/materializer-min',
        'bin/md',
        'bin/resources',
        'bin/bower/resources/',
        'bin/bower/bower.json',
        'bin/bower-min/resources/',
        'bin/bower-min/bower.json',
        'grunt-materializer/sources/'
        ],

      // 2 - Compiling json to css on bin/materializer/
      compiler: {
        css: {
            expand: true,
            src: [
              'source/attribute/*.json',
              'source/tag/*.json'
            ],
            dest: 'bin/',
            ext: '.css',
            rename: function(dest, src) {
              var newDest = dest + src.replace("source", "md");
              return newDest;
          },
          options: {
            configfile: 'source/md-settings.json',
            imports: 'source/import'
          }
        },
      },

      // 3 - Coping everything
      copy: {
        main: {
          expand: true,
          src: [
            'source/css/*',
            '!source/**.json'
          ],
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source", "md");
            return newDest;
          }
        },
        font: {
          expand: true,
          src: 'source/resources/font/*',
          dest: 'bin/materializer/resources/font/',
          flatten: true
        },
        cursor: {
          expand: true,
          src: 'source/resources/cursor/*',
          dest: 'bin/materializer/resources/cursor/',
          flatten: true
        },
        icon: {
          expand: true,
          src: 'node_modules/material-design-icons/*/svg/production/*_24px.svg',
          dest: 'bin/materializer/resources/icon/',
          flatten: true,
          rename: function(dest,src) {
            var newDest = dest + src.replace("ic_", "");
            newDest = newDest.replace("_24px", "");
            return newDest;
          }
        },
        moreicon: {
          expand: true,
          src: 'source/resources/more-icons/**/*.svg',
          dest: 'bin/materializer/resources/icon/',
          flatten: true
        },
        other: {
          expand: true,
          src: 'source/resources/other/**/*',
          dest: 'bin/materializer/resources/other/',
          flatten: true
        },
        resourcesToMin: {
          expand: true,
          src: 'bin/materializer/resources/**',
          dest: 'bin/materializer-min/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("bin/materializer/", "");
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
        },
        bower: {
          expand: true,
          src: [
          'bin/materializer/**',
          'source/repo_files/bower.json'
          ],
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source/repo_files", "bower").replace("bin/materializer", "bower");
            return newDest;
          }
        },
        bowerMin: {
          expand: true,
          src: [
          'bin/materializer-min/**',
          'source/repo_files/bower-min.json'
          ],
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source/repo_files", "bower-min").replace("bin/materializer-min", "bower-min").replace("bower-min.json", "bower.json");
            return newDest;
          }
        },
        materializerDemo: {
          expand: true,
          cwd: 'bin',
          src: [ 'materializer-min/**' ],
          dest: 'md-elements-demo/'
        }        
      },

      // 4 - Autoprefixing all css from bin/materializer/
      autoprefixer: {
        options: {
          browsers: ["last 2 versions", "ie 9", "iOS 6", "Safari 6.2", "ChromeAndroid 25", "FirefoxAndroid 20", 'opera 12', 'ff 15', 'chrome 25']
        },
        prefix: {
          src: [
            'bin/md/attribute/*.css',
            'bin/md/tag/*.css',
            'bin/md/class/*.css',
            'bin/md/css/*.css'
          ]
        }
      },

      // 4 - Beautify everything
      cssbeautifier:{files:[    "bin/md/**/*.css"    ]},

      // 5 - Concatenating css and js from bin/materializer/ to bin/
      concat: {
        css: {
          src: [
            'bin/md/css/*.css',
            'bin/md/tag/*.css',
            'bin/md/attribute/*.css'
          ],
          dest: 'bin/materializer/materializer.css'
        },
        js: {
          src: [
            'source/javascript/*.js'
          ],
          dest: 'bin/materializer/materializer.js'
        }
      },

      // 6 - Minify css
      cssmin: {
        minify: {
          src: 'bin/materializer/materializer.css',
          dest: 'bin/materializer-min/materializer.css'
        }
      },

      // 7 - Uglify css
      uglify: {
        build: {
          src: 'bin/materializer/materializer.js',
          dest: 'bin/materializer-min/materializer.js'
        }
      }
  });

  // Loading our custom tasks
  grunt.loadTasks('tasks');
  grunt.loadTasks('tasks/grunt-materializer-compiler-v2');

  // Loading NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-cssbeautifier');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // This will run when executing grunt
  grunt.registerTask('default', ['clean','compiler',
    'copy:main','copy:font','copy:cursor','copy:icon','copy:moreicon','copy:other','copy:resourcesToMin','copy:dev','copy:mdcss',
    "autoprefixer",'cssbeautifier','concat','cssmin','uglify','copy:bower','copy:bowerMin','copy:materializerDemo',]);
  grunt.registerTask('dev', ['copy:dev']);
};
