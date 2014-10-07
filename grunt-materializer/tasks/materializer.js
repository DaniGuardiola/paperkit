/*
 * grunt-materializer
 * materializer.daniguardiola.me
 *
 * Copyright (c) 2014 Dani Muñoz Guardiola
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('materializer', 'The easy Material Design framework, easier', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      mdPath: './'
    });

    var objectsMap = {};

    var processMCSS= function(mcssFile) {
      var mcssData = mcssFile.split('\n');

      for(var i=0; i < mcssData.length; i++) {
        var prop = mcssData[i].match(/\s*(.*?)\s*:/);

        if(prop != null && objectsMap[prop[1]]) {

          var value = mcssData[i].match(/.*:\s*(.*?)\s*;\s*/);

          var repl = objectsMap[prop[1]][value[1]];
          if(repl) {
            mcssData[i] = "  /* " + value[1] + "*/\n  " + repl.replace(/;/g, ';\n  ') + ";\n";
          }
        }
      }

      return mcssData.join('\n');
    };

    var parseMaterializer = function(text) {
      var re = /\[(.*?)]\s*{\s*(.*?)\s*}/mg;
      var result;

      text = text.replace(/\n/g, "");

      do {
        result = re.exec(text);
        if(result != null) {
          if(result[1].search(/\],\**\[/) > -1) {
            var keys = result[1].split(/\],\**\[/);

            for(var i=0; i < keys.length; i++) {
              parseSingle(keys[i], result[2]);
            }

          } else {
            parseSingle(result[1], result[2]);
          }
        }
      } while(result != null)
    };

    var parseSingle = function(key, value) {
      var keys = key.split("=");
      var obj = {};

      if(objectsMap[keys[0]]) {
        obj = objectsMap[keys[0]];
      }

      obj[keys[1]] = value;

      objectsMap[keys[0]] = obj;
    };

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

      parseMaterializer(mdFile);

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
        var data = grunt.file.read(filepath, { encoding: 'utf8' })
        return data;
      }).join('\n');

      // Handle options.
      src = processMCSS(src);

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};
