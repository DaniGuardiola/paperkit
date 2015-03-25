/* global module */
module.exports = function(grunt) {
  // Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Clean tasks
    clean: {
      bin: {
        src: ["bin/"]
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
