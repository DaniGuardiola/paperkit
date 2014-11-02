var winston = require('winston');
var fs = require('fs');
var Generator = require('../lib/generator.js');

exports.testAttribute = function(test) {
    var settings = fs.readFileSync('fixtures/md-settings.json');
    var attribute = fs.readFileSync('fixtures/md-attribute.json');
    var expected = fs.readFileSync('expected/attribute.css');

    var generator = new Generator(attribute, settings);
    var generatedCSS = generator.generate();

    fs.writeFile('tmp1.css', generatedCSS);
    // console.log(generatedCSS);

    test.equal(generatedCSS, expected);
    test.done();
  }

  exports.testTag = function(test) {
    var settings = fs.readFileSync('fixtures/md-settings.json');
    var tag = fs.readFileSync('fixtures/md-tag.json');
    var expected = fs.readFileSync('expected/tag.css');

    var generator = new Generator(tag, settings);
    var generatedCSS = generator.generate();
    fs.writeFile('tmp2.css', generatedCSS);
    // console.log(generatedCSS);

    test.equal(generatedCSS, expected);
    test.done();
  }