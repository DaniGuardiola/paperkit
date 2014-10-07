/*
 * grunt-materializer
 * materializer.daniguardiola.me
 *
 * Copyright (c) 2014 Dani Muñoz Guardiola
 * Licensed under the MIT license.
 */

'use strict';


var mp = new MaterializerParser('test.mcss', 'test.css');
mp.process();

function MaterializerParser(origFile, destFile) {
  var fs = require('fs');

  this.objectsMap = {};
  this.origFile = origFile;
  this.destFile = destFile;

  this.process= function() {
    var mcssFile = fs.readFileSync(origFile, { encoding: 'utf8' });
    var cssFile = fs.createWriteStream(destFile);

    this.loadMaterializer('materializer.css');

    mcssData = mcssFile.split('\n');

    for(var i=0; i < mcssData.length; i++) {
      var prop = mcssData[i].match(/\s*(.*?)\s*:/);

      console.log(mcssData[i] + " ===> " + prop);

      if(prop != null && this.objectsMap[prop[1]]) {

        var value = mcssData[i].match(/.*:\s*(.*?)\s*;\s*/);

        console.log("'"+value[1]+"'");

        var repl = this.objectsMap[prop[1]][value[1]];
        if(repl) {
          cssFile.write(repl + '\n');
        } else {
          cssFile.write(mcssData[i] + '\n');
        }
      } else {
        cssFile.write(mcssData[i] + '\n');
      }
    }

    cssFile.end();
  },

  this.loadMaterializer = function(file) {
    var data = fs.readFileSync(file, { encoding: 'utf8' });
    this.parseText(data);
  },

  this.parseText = function(text) {
    var re = /\[(.*?)]\s*{\s*(.*?)\s*}/mg;
    var result;

    text = text.replace(/\n/g, "");

    do {
      result = re.exec(text);
      if(result != null) {
        if(result[1].search(/\],\**\[/) > -1) {
          var keys = result[1].split(/\],\**\[/);

          for(var i=0; i < keys.length; i++) {
            this.parseSingle(keys[i], result[2]);
          }

        } else {
          this.parseSingle(result[1], result[2]);
        }
      }
    } while(result != null)
  },

  this.parseSingle = function(key, value) {
    var keys = key.split("=");
    var obj = {};

    if(this.objectsMap[keys[0]]) {
      obj = this.objectsMap[keys[0]];
    }

    obj[keys[1]] = value;

    this.objectsMap[keys[0]] = obj;
  }
}


module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('materializer', 'The easy Material Design framework, easier', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });


    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
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
        return grunt.file.read(filepath);
      });

      // Handle options.
      src = //MaterializerParser(src) el return debería llevar el string modificado

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
