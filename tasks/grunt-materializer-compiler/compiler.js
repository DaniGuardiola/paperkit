var Generator=require('./lib/generator.js');

module.exports = function(grunt) {  
  grunt.registerMultiTask('compiler', 'Materializer compiler', function() {
    var options = this.options();

    this.files.forEach(function(f) {
      // Read source file
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

      var config  = grunt.file.read(options.configfile);
      var generator = new Generator(src, config);
      var generatedData = generator.generate();
      grunt.file.write(f.dest, generatedData);
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
}