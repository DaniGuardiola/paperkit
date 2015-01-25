module.exports = function(grunt) {

  // Configuration
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // 1 - Cleaning bin and grunt-materializer/sources/
      clean: {
        bin: {
          src: [ 'bin/' ]
        },
        web: {
          src: [ 'web/paperkit-min/' ]
        },
        publish: {
          src: [ 'web/d/' ]
        }
      },

      // 2 - Compiling json to css on bin/paperkit-files/
      compiler: {
        css: {
            expand: true,
            src: [
              'source/attribute/**/*.json',
              'source/tag/**/*.json'
            ],
            dest: 'bin/',
            ext: '.css',
            rename: function(dest, src) {
              var newDest = dest + src.replace("source", "paperkit-files");
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
        css: {
          expand: true,
          src: [
            'source/css/*'
          ],
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source", "paperkit-files");
            return newDest;
          }
        },
        resourcesFont: {
          expand: true,
          src: 'source/resources/font/*',
          dest: 'bin/paperkit-files/resources/font/',
          flatten: true
        },
        resourcesCursor: {
          expand: true,
          src: 'source/resources/cursor/*',
          dest: 'bin/paperkit-files/resources/cursor/',
          flatten: true
        },
        resourcesIcon: {
          expand: true,
          src: 'node_modules/material-design-icons/*/svg/production/*_24px.svg',
          dest: 'bin/paperkit-files/resources/icon/',
          flatten: true,
          rename: function(dest,src) {
            var newDest = dest + src.replace("ic_", "");
            newDest = newDest.replace("_24px", "");
            return newDest;
          }
        },
        resourcesMoreIcon: {
          expand: true,
          src: 'source/resources/more-icons/**/*.svg',
          dest: 'bin/paperkit-files/resources/icon/',
          flatten: true
        },
        resourcesOther: {
          expand: true,
          src: 'source/resources/other/**/*',
          dest: 'bin/paperkit-files/resources/other/',
          flatten: true
        },
        resourcesToPaperkit: {
          expand: true,
          src: 'bin/paperkit-files/resources/**',
          dest: 'bin/paperkit/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("bin/paperkit-files/", "");
            return newDest;
          }
        },
        resourcesToPaperkitMin: {
          expand: true,
          src: 'bin/paperkit-files/resources/**',
          dest: 'bin/paperkit-min/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("bin/paperkit-files/", "");
            return newDest;
          }
        },
        sourceToMdcss: {
          expand: true,
          src: 'source/**/*.json',
          dest: 'grunt-paperkit/sources/',
          flatten: true
        },
        mdcss: {
          src: 'grunt-paperkit/**',
          dest: 'bin/'
        },
        /*bower: {
          expand: true,
          src: [
          'bin/paperkit/**',
          'source/repo_files/bower.json'
          ],
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source/repo_files", "bower").replace("bin/paperkit", "bower");
            return newDest;
          }
        },
        bowerMin: {
          expand: true,
          src: [
          'bin/paperkit-min/**',
          'source/repo_files/bower-min.json'
          ],
          dest: 'bin/',
          rename: function(dest, src) {
            var newDest = dest + src.replace("source/repo_files", "bower-min").replace("bin/paperkit-min", "bower-min").replace("bower-min.json", "bower.json");
            return newDest;
          }
        },*/
        web: {
          expand: true,
          cwd: 'bin',
          src: [ 'paperkit-min/**' ],
          dest: 'web/'
        }        
      },

      // 4 - Autoprefixing all css from bin/materializer/
      autoprefixer: {
        options: {
          browsers: ["last 2 versions", "ie 9", "iOS 6", "Safari 6.2", "ChromeAndroid 25", "FirefoxAndroid 20", 'opera 12', 'ff 15', 'chrome 25']
        },
        prefix: {
          src: [
            'bin/paperkit-files/attribute/*.css',
            'bin/paperkit-files/tag/*.css',
            'bin/paperkit-files/css/*.css'
          ]
        }
      },


      // 4 - Beautify everything
      cssbeautifier:{files:[    "bin/paperkit-files/**/*.css"    ]},

      // 5 - Concatenating css and js from bin/materializer/ to bin/
      concat: {
        css: {
          src: [
            'bin/paperkit-files/css/*.css',
            'bin/paperkit-files/tag/*.css',
            'bin/paperkit-files/attribute/*.css'
          ],
          dest: 'bin/paperkit/paperkit.css'
        },
        js: {
          src: [
            'source/javascript/*.js'
          ],
          dest: 'bin/paperkit/paperkit.js'
        }
      },

      // 6 - Minify css
      cssmin: {
        minify: {
          src: 'bin/paperkit/paperkit.css',
          dest: 'bin/paperkit-min/paperkit.css'
        }
      },

      // 7 - Uglify css
      uglify: {
        build: {
          src: 'bin/paperkit/paperkit.js',
          dest: 'bin/paperkit-min/paperkit.js'
        }
      },
      
      // 8 - Generate zip files
      compress: {
        paperkit: {          
          options: {
            mode: 'zip',
            archive: 'web/d/paperkit.zip'
          },
          expand: true,
          cwd: 'bin/paperkit',
          src: [ '**' ],
          dest: 'paperkit/'
        },
        paperkitmin: {          
          options: {
            mode: 'zip',
            archive: 'web/d/paperkit-min.zip'
          },
          expand: true,
          cwd: 'bin/paperkit-min',
          src: [ '**' ],
          dest: 'paperkit/'
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
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-cssbeautifier');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Tasks
  grunt.registerTask('package', ['clean:bin','compiler',
    'copy:css','copy:resourcesFont','copy:resourcesCursor','copy:resourcesIcon','copy:resourcesMoreIcon','copy:resourcesOther','copy:resourcesToPaperkit','copy:resourcesToPaperkitMin',
    "autoprefixer",'cssbeautifier','concat','cssmin','uglify']);

  grunt.registerTask('web', ['package', 'clean:web', 'copy:web']);
  grunt.registerTask('publish', ['package', 'clean:publish', 'compress']);  
  grunt.registerTask('default', ['package']);
};
