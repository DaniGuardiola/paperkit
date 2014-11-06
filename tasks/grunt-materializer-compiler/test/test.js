var winston = require('winston');
var fs = require('fs');
var Generator = require('../lib/generator.js');

exports.testVariants = function(test) {
    var settings = fs.readFileSync('fixtures/md-settings.json');
    var attribute = fs.readFileSync('fixtures/md-variant.json');
    var expected = fs.readFileSync('expected/variant.css');

    var generator = new Generator(attribute, settings);
    var generatedCSS = generator.generate();

    fs.writeFile('tmpvariant.css', generatedCSS);
    test.equal(generatedCSS, expected);
    test.done();    
}

exports.testAttribute = function(test) {
    var settings = fs.readFileSync('fixtures/md-settings.json');
    var attribute = fs.readFileSync('fixtures/md-attribute.json');
    var expected = fs.readFileSync('expected/attribute.css');

    var generator = new Generator(attribute, settings);
    var generatedCSS = generator.generate();

    fs.writeFile('tmp1.css', generatedCSS);
    test.equal(generatedCSS, expected);
    test.done();
  }

exports.testAttributeWithoutValues = function(test) {
    var settings = fs.readFileSync('fixtures/md-settings.json');
    var attribute = fs.readFileSync('fixtures/md-attribute-without-values.json');
    var expected = fs.readFileSync('expected/attribute-without-values.css');

    var generator = new Generator(attribute, settings);
    var generatedCSS = generator.generate();

    fs.writeFile('tmpAttributeWithoutValues.css', generatedCSS);
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
    test.equal(generatedCSS, expected);
    test.done();
  }

  exports.testTagParent = function(test) {
    var settings = fs.readFileSync('fixtures/md-settings.json');
    var tag = fs.readFileSync('fixtures/md-tag-parent.json');
    var expected = fs.readFileSync('expected/tag-parent.css');

    var generator = new Generator(tag, settings);
    var generatedCSS = generator.generate();
    fs.writeFile('tmpTagParent.css', generatedCSS);
    test.equal(generatedCSS, expected);
    test.done();    
  }

  exports.testFixes = function(test) {
    var settings = fs.readFileSync('fixtures/md-settings.json');
    var tag = fs.readFileSync('fixtures/md-fixes.json');
    var expected = fs.readFileSync('expected/md-fixes.css');

    var generator = new Generator(tag, settings);
    var generatedCSS = generator.generate();
    fs.writeFile('tmpFixes.css', generatedCSS);
    test.equal(generatedCSS, expected);
    test.done();    
  }