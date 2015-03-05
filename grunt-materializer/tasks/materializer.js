/*
 * grunt-materializer
 * materializer.daniguardiola.me
 *
 * Copyright (c) 2014 Dani Muñoz Guardiola
 * Licensed under the MIT license.
 */

'use strict';

var Materializer = require("../lib/materializer/index.js");

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('materializer', 'The easy Material Design framework, easier', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      mdPath: './'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.

      if (grunt.file.exists(options.mdPath + "materializer.css") || grunt.file.exists(options.mdPath + "materializer.min.css")) {
        if (grunt.file.exists(options.mdPath + "materializer.css")) {
          var mdFile = grunt.file.read(options.mdPath + "materializer.css");
        } else if (grunt.file.exists(options.mdPath + "materializer.min.css")) {
          var mdFile = grunt.file.read(options.mdPath + "materializer.min.css");
        }
      } else {
        grunt.log.warn('Materializer was not found at ' + options.mdPath);
        return false;
      }

      var materializer = new Materializer(mdFile);

      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        var data = grunt.file.read(filepath, {
          encoding: 'utf8'
        })
        return data;
      }).join('\n');

      // Handle options.
      src = materializer.process(src);

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};
