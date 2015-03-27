/* global module */
module.exports = function(grunt) {
  // Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Generation of documentation
    jsdoc: {
      coreJS: {
        src: ["bin/paperkit-core-dev/paperkit.js"],
        dest: "doc/core",
        options: {
          "private": true,
          "template": "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
          "configure": "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      },
      module: {
        src: ["bin/paperkit-blocks-dev/module/*.js"],
        dest: "doc/modules",
        options: {
          "private": false,
          "template": "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
          "configure": "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      }
    },

    // Cleaning
    clean: {
      all: {
        src: ["bin", "doc"]
      },
      core: {
        src: ["bin/paperkit-core", "bin/paperkit-core-dev", "doc/core"]
      },
      blocks: {
        src: ["bin/paperkit-blocks", "bin/paperkit-blocks-dev", "doc/blocks"]
      },
      module: {
        src: ["bin/paperkit-blocks/module", "bin/paperkit-blocks-dev/module", "doc/blocks/module"]
      }
    },

    // Copying
    copy: {
      module: {
        expand: true,
        src: [
          "src/module/*.js"
        ],
        dest: "bin/paperkit-blocks-dev/module/",
        flatten: true
      }
    },

    // Concatenation
    concat: {
      coreJS: {
        src: [
          "src/core/core.js",
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
      },
      module: {
        expand: true,
        src: "bin/paperkit-blocks-dev/module/*.js",
        dest: "bin/paperkit-blocks/module/",
        flatten: true
      }
    },

  });

  // Loading json-to-css, temporal
  // grunt.loadTasks("json-to-css");
  // grunt.loadTasks("json-to-css/old-v2/");

  // Loading NPM tasks
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-jsdoc");

  // Output (bin/)
  // "-dev" suffix means not uglified and minified
  grunt.registerTask("core", [ // paperkit-core/
    "clean:core",
    "concat:coreJS",
    "uglify:coreJS",
    "jsdoc:coreJS"
  ]);

  grunt.registerTask("module", [ // paperkit-blocks/module/
    "clean:module",
    "copy:module",
    "uglify:module",
    "jsdoc:module"
  ]);

  // Shortcuts and utils
  grunt.registerTask("blocks", [ // paperkit-blocks/
    "clean:blocks",
    "module"
  ]);

  // Default
  grunt.registerTask("default", [
    "clean:all",
    "core",
    "blocks"
  ]);
};
