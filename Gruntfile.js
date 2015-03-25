/* global module */
module.exports = function(grunt) {
  // Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Generation of documentation
    jsdoc: {
      coreJS: {
        src: ["bin/paperkit-core-dev/paperkit.js"],
        dest: "doc/core/"
      }
    },

    // Cleaning
    clean: {
      core: {
        src: ["bin/paperkit-core", "bin/paperkit-core-dev", "doc/core/"]
      },
      module: {
        src: ["bin/paperkit-blocks/module", "bin/paperkit-blocks/module", "doc/module/"]
      }
    },

    // Copying
    copy: {
      module: {
        expand: true,
        src: [
          "src/module/*.js"
        ],
        dest: "bin/",
        rename: function(dest, src) {
          var newDest = dest + src.replace("source", "paperkit-files");
          return newDest;
        }
      }
    },

    // Concatenation
    concat: {
      coreJS: {
        src: [
          "src/core/js/md.js",
          "src/core/module/*.js",
        ],
        dest: "bin/paperkit-core-dev/paperkit.js"
      }
    },

    // JavaScript minification
    uglify: {
      coreJS: {
        src: "bin/paperkit-core-dev/paperkit.js",
        dest: "bin/paperkit-core/paperkit.js"
      }
    },

  });

  // Loading json-to-css, temporal
  // grunt.loadTasks("json-to-css");
  // grunt.loadTasks("json-to-css/old-v2/");

  // Loading NPM tasks
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks("grunt-contrib-copy");

  // Tasks
  grunt.registerTask("core", [
    "clean:core",
    "concat:coreJS",
    "uglify:coreJS",
    "jsdoc:coreJS",
  ]);


  grunt.registerTask("module", [
    "clean:module",
    "concat:coreJS",
    "uglify:coreJS",
    "jsdoc:coreJS",
  ]);

  grunt.registerTask("default", []);
};
