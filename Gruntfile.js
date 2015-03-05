/* global module */
module.exports = function(grunt) {
  // Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Documentation
    jsdoc: {
      dist: {
        src: ["labs/*.js"],
        options: {
          destination: "labs"
        }
      }
    },

    // Clean tasks
    clean: {
      bin: {
        src: ["bin/"]
      },
      tmpBin: {
        src: ["bin/tmp"]
      },
      web: {
        src: ["web/paperkit-min/"]
      },
      publish: {
        src: ["web/download/paperkit.zip", "web/download/paperkit-min.zip"]
      }
    },

    // Compiler: JSON to CSS
    compiler: {
      css: {
        expand: true,
        src: [
          "source/tag/md-toolbar/md-toolbar.json",


          "source/attribute/**/*.json",
          "source/tag/**/*.json"
        ],
        dest: "bin/",
        ext: ".css",
        rename: function(dest, src) {
          var newDest = dest + src.replace("source", "paperkit-files");
          return newDest;
        },
        options: {
          configfile: "source/settings.json",
          imports: "source/import"
        }
      },
    },

    // Copy tasks
    copy: {
      css: {
        expand: true,
        src: [
          "source/css/*"
        ],
        dest: "bin/",
        rename: function(dest, src) {
          var newDest = dest + src.replace("source", "paperkit-files");
          return newDest;
        }
      },
      resourcesFont: {
        expand: true,
        src: "source/resources/font/*",
        dest: "bin/paperkit-files/resources/font/",
        flatten: true
      },
      resourcesCursor: {
        expand: true,
        src: "source/resources/cursor/*",
        dest: "bin/paperkit-files/resources/cursor/",
        flatten: true
      },
      resourcesIcon: {
        expand: true,
        src: "node_modules/material-design-icons/*/svg/production/*_24px.svg",
        dest: "bin/paperkit-files/resources/icon/",
        flatten: true,
        rename: function(dest, src) {
          var newDest = dest + src.replace("ic_", "");
          newDest = newDest.replace("_24px", "");
          return newDest;
        }
      },
      resourcesIconLicense: {
        expand: true,
        src: "node_modules/material-design-icons/LICENSE",
        dest: "bin/paperkit-files/resources/icon/",
        flatten: true,
        rename: function(dest, src) {
          var newDest = dest + src.replace("LICENSE", "google_license");
          return newDest;
        }
      },
      resourcesExtraIcon: {
        expand: true,
        src: "bin/tmp/icons/svg/*.svg",
        dest: "bin/paperkit-files/resources/icon/",
        flatten: true,
        rename: function(dest, src) {
          var newDest = dest + src.replace("ic_", "");
          newDest = newDest.replace("_24px", "");
          return newDest;
        }
      },
      resourcesExtraIconConverter: {
        expand: true,
        src: "source/tools/icon-convert.js",
        dest: "bin/tmp/icons/svg/",
        flatten: true
      },
      resourcesExtraIconLicense: {
        expand: true,
        src: "bin/tmp/license.txt",
        dest: "bin/paperkit-files/resources/icon/",
        flatten: true,
        rename: function(dest, src) {
          var newDest = dest + src.replace("license.txt", "templarian_license");
          return newDest;
        }
      },
      resourcesMoreIcon: {
        expand: true,
        src: "source/resources/more-icons/**/*.svg",
        dest: "bin/paperkit-files/resources/icon/",
        flatten: true
      },
      resourcesOther: {
        expand: true,
        src: "source/resources/other/**/*",
        dest: "bin/paperkit-files/resources/other/",
        flatten: true
      },
      resourcesToPaperkit: {
        expand: true,
        src: "bin/paperkit-files/resources/**",
        dest: "bin/paperkit/",
        rename: function(dest, src) {
          var newDest = dest + src.replace("bin/paperkit-files/", "");
          return newDest;
        }
      },
      resourcesToPaperkitMin: {
        expand: true,
        src: "bin/paperkit-files/resources/**",
        dest: "bin/paperkit-min/",
        rename: function(dest, src) {
          var newDest = dest + src.replace("bin/paperkit-files/", "");
          return newDest;
        }
      },
      sourceToMdcss: {
        expand: true,
        src: "source/**/*.json",
        dest: "grunt-paperkit/sources/",
        flatten: true
      },
      mdcss: {
        src: "grunt-paperkit/**",
        dest: "bin/"
      },
      bower: {
        expand: true,
        src: [
          "bin/paperkit/**"
        ],
        dest: "bin/tmp/paperkit-bower/",
        rename: function(dest, src) {
          var newDest = dest + src.replace("bin/paperkit", "").replace("source/repo_files", "");
          return newDest;
        }
      },
      bowerMin: {
        expand: true,
        src: [
          "bin/paperkit-min/**"
        ],
        dest: "bin/tmp/paperkit-bower-min/",
        rename: function(dest, src) {
          var newDest = dest + src.replace("bin/paperkit-min", "").replace("source/repo_files", "");
          return newDest;
        }
      },
      web: {
        expand: true,
        cwd: "bin",
        src: ["paperkit-min/**"],
        dest: "web/"
      },
      license: {
        expand: true,
        src: "bin/paperkit-files/LICENSE",
        dest: "bin/paperkit",
        flatten: true
      },
      licenseMin: {
        expand: true,
        src: "bin/paperkit-files/LICENSE",
        dest: "bin/paperkit-min",
        flatten: true
      }
    },

    // Autoprefixer
    autoprefixer: {
      options: {
        browsers: ["last 2 versions", "ie 9", "iOS 6", "Safari 6.2", "ChromeAndroid 25", "FirefoxAndroid 20", "opera 12", "ff 15", "chrome 25"]
      },
      prefix: {
        src: [
          "bin/paperkit-files/attribute/*.css",
          "bin/paperkit-files/tag/*.css",
          "bin/paperkit-files/css/*.css"
        ]
      }
    },

    // Shell tasks
    exec: {
      cloneIcons: {
        command: "git clone https://github.com/Templarian/MaterialDesign bin/tmp/"
      },
      convertIcons: {
        command: "node bin/tmp/icons/svg/icon-convert.js"
      },
      npmUpdate: {
        command: "npm update"
      },
      ulimit: {
        command: "ulimit -S -n 2048"
      },
      bower: {
        command: "rm -rf -f ~/proyectos/stable-paperkit/resources/ && rm -f ~/proyectos/stable-paperkit/paperkit.css && rm -f ~/proyectos/stable-paperkit/paperkit.js && rm -f ~/proyectos/stable-paperkit/LICENSE && mv -f bin/tmp/paperkit-bower/* ~/proyectos/stable-paperkit/"
      },
      bowerMin: {
        command: "rm -rf -f ~/proyectos/stable-paperkit-min/resources/ && rm -f ~/proyectos/stable-paperkit-min/paperkit.css && rm -f ~/proyectos/stable-paperkit-min/paperkit.js && rm -f ~/proyectos/stable-paperkit-min/LICENSE && mv -f bin/tmp/paperkit-bower-min/* ~/proyectos/stable-paperkit-min/"
      },
      bowerGrunt: {
        command: "grunt --base ~/proyectos/stable-paperkit/ --gruntfile ~/proyectos/stable-paperkit/Gruntfile.js"
      },
      bowerMinGrunt: {
        command: "grunt --base ~/proyectos/stable-paperkit-min/ --gruntfile ~/proyectos/stable-paperkit-min/Gruntfile.js"
      },
      bowerGruntMinor: {
        command: "grunt --base ~/proyectos/stable-paperkit/ --gruntfile ~/proyectos/stable-paperkit/Gruntfile.js exec:stageAll release:minor"
      },
      bowerMinGruntMinor: {
        command: "grunt --base ~/proyectos/stable-paperkit-min/ --gruntfile ~/proyectos/stable-paperkit-min/Gruntfile.js exec:stageAll release:minor"
      },
      bowerGruntMajor: {
        command: "grunt --base ~/proyectos/stable-paperkit/ --gruntfile ~/proyectos/stable-paperkit/Gruntfile.js exec:stageAll release:major"
      },
      bowerMinGruntMajor: {
        command: "grunt --base ~/proyectos/stable-paperkit-min/ --gruntfile ~/proyectos/stable-paperkit-min/Gruntfile.js exec:stageAll release:major"
      },
      bowerGruntPre: {
        command: "grunt --base ~/proyectos/stable-paperkit/ --gruntfile ~/proyectos/stable-paperkit/Gruntfile.js exec:stageAll release:prerelease"
      },
      bowerMinGruntPre: {
        command: "grunt --base ~/proyectos/stable-paperkit-min/ --gruntfile ~/proyectos/stable-paperkit-min/Gruntfile.js exec:stageAll release:prerelease"
      }
    },


    // Beautifier
    cssbeautifier: {
      files: ["bin/paperkit-files/**/*.css"]
    },

    // Concatenator
    concat: {
      css: {
        src: [
          "bin/paperkit-files/css/**/*.css",
          "bin/paperkit-files/tag/**/*.css",
          "bin/paperkit-files/attribute/**/*.css"
        ],
        dest: "bin/paperkit/paperkit.css"
      },
      js: {
        src: [
          "source/javascript/**/*.js"
        ],
        dest: "bin/paperkit/paperkit.js"
      },
      licenses: {
        src: [
          "license/LICENSE",
          "license/font-banner.txt",
          "source/resources/font/LICENSE.txt",
          "license/icon-banner.txt",
          "node_modules/material-design-icons/LICENSE",
          "license/extra-icon-banner.txt",
          "bin/paperkit-files/resources/icon/templarian_license"
        ],
        dest: "bin/paperkit-files/LICENSE"
      }
    },

    // Minifier
    cssmin: {
      minify: {
        src: "bin/paperkit/paperkit.css",
        dest: "bin/paperkit-min/paperkit.css"
      }
    },

    // Uglifier
    uglify: {
      build: {
        src: "bin/paperkit/paperkit.js",
        dest: "bin/paperkit-min/paperkit.js"
      }
    },

    // Compressor
    compress: {
      paperkit: {
        options: {
          mode: "zip",
          archive: "web/download/paperkit.zip"
        },
        expand: true,
        cwd: "bin/paperkit",
        src: ["**"],
        dest: "paperkit/"
      },
      paperkitMin: {
        options: {
          mode: "zip",
          archive: "web/download/paperkit-min.zip"
        },
        expand: true,
        cwd: "bin/paperkit-min",
        src: ["**"],
        dest: "paperkit/"
      },
      paperkitDev: {
        options: {
          mode: "zip",
          archive: "web/download/paperkit-dev.zip"
        },
        expand: true,
        cwd: "bin/paperkit",
        src: ["**"],
        dest: "paperkit/"
      }
    },

    // Releaser
    release: {
      options: {
        file: "bower.json", //default: package.json
        npm: false, //default: true
        folder: "bin/bower", //default project root
        github: {
          repo: "daniguardiola/paperkit-stable", //put your user/repo here
          usernameVar: "GITHUB_USERNAME", //ENVIRONMENT VARIABLE that contains Github username
          passwordVar: "GITHUB_PASSWORD" //ENVIRONMENT VARIABLE that contains Github password
        }
      }
    }
  });

  // Loading our custom tasks
  grunt.loadTasks("tasks");
  grunt.loadTasks("tasks/grunt-materializer-compiler-v2");

  // Loading NPM tasks
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-autoprefixer");
  grunt.loadNpmTasks("grunt-cssbeautifier");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-jsdoc");

  // Tasks
  grunt.registerTask("package", ["exec:npmUpdate", "clean:bin", "compiler", "exec:cloneIcons", "copy:resourcesExtraIconConverter", "exec:convertIcons",
    "copy:css", "copy:resourcesFont", "copy:resourcesCursor", "copy:resourcesExtraIcon", "copy:resourcesIcon", "copy:resourcesIconLicense", "copy:resourcesExtraIconLicense", "clean:tmpBin", "copy:resourcesMoreIcon", "copy:resourcesOther", "copy:resourcesToPaperkit", "copy:resourcesToPaperkitMin",
    "autoprefixer", "cssbeautifier", "concat", "copy:license", "copy:licenseMin", "cssmin", "uglify"
  ]);

  grunt.registerTask("web", ["clean:web", "copy:web"]);
  grunt.registerTask("publish", ["clean:publish", "exec:ulimit", "compress:paperkit", "compress:paperkitMin", "copy:bower", "exec:bower", "exec:bowerGrunt", "copy:bowerMin", "exec:bowerMin", "exec:bowerMinGrunt", "clean:tmpBin"]);
  grunt.registerTask("publishMinor", ["clean:publish", "exec:ulimit", "compress:paperkit", "compress:paperkitMin", "copy:bower", "exec:bower", "exec:bowerGruntMinor", "copy:bowerMin", "exec:bowerMin", "exec:bowerMinGruntMinor", "clean:tmpBin"]);
  grunt.registerTask("publishMajor", ["clean:publish", "exec:ulimit", "compress:paperkit", "compress:paperkitMin", "copy:bower", "exec:bower", "exec:bowerGruntMajor", "copy:bowerMin", "exec:bowerMin", "exec:bowerMinGruntMajor", "clean:tmpBin"]);
  grunt.registerTask("publishPre", ["clean:publish", "exec:ulimit", "compress:paperkit", "compress:paperkitMin", "copy:bower", "exec:bower", "exec:bowerGruntPre", "copy:bowerMin", "exec:bowerMin", "exec:bowerMinGruntPre", "clean:tmpBin"]);

  grunt.registerTask("publishDev", ["clean:publish", "exec:ulimit", "compress:paperkitDev"]);
  grunt.registerTask("default", ["package"]);
};
