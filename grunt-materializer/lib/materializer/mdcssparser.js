fs = require('fs')
winston = require('winston')
css = require('css')
sprintf = require('sprintf')

module.exports = mdcssParser;

function mdcssParser() {
  var jsonData = [];
  var PATH = "../source_files";

  var readSourceFiles = function() {
    fs.readdirSync(PATH).forEach(function(sourceFile) {
      if (/.*\.json/.test(sourceFile)) {
        jsonData.push(JSON.parse(fs.readFileSync(PATH + "/" + sourceFile)));
      }
    });
  };

  this.parse = function(mdcssSrc) {
    readSourceFiles();

    var mdcssData = css.parse(mdcssSrc);
    var cssData = {
      type: "stylesheet",
      stylesheet: {
        rules: []
      }
    };

    mdcssData.stylesheet.rules.forEach(function(mdcssRule) {
      winston.debug(sprintf("Rule => [%s]", JSON.stringify(mdcssRule)));

      var cssRule = JSON.parse(JSON.stringify(mdcssRule));
      cssRule.declarations = [];

      mdcssRule.declarations.forEach(function(mdcssDeclaration) {
        var valuesArray = mdcssDeclaration.value.split(" ");

        var tag = getTag(mdcssDeclaration.property);
        var value = getValue(tag, valuesArray[0]);
        winston.debug(sprintf("Tag [%s] Value [%s]", tag.name, value ? value.name : "NO VALUE"));
        var variantName = valuesArray.length > 1 ? valuesArray[1] : value.defaultVariant;
        var variant = getVariant(value, variantName);

        variant.css.forEach(function(css) {
          var cssDeclaration = {
            type: "declaration",
            property: css.property,
            value: css.value
          };

          cssRule.declarations.push(cssDeclaration);
        });
      });

      cssData.stylesheet.rules.push(cssRule);
    });

    return css.stringify(cssData);
  };

  var getTag = function(tagName) {
    for (var i = 0; i < jsonData.length; i++) {
      if (jsonData[i].name == tagName) {
        return jsonData[i];
      }
    }

    return null;
  };

  var getValue = function(tag, valueName) {
    winston.debug(sprintf("Searching in tag [%s] for valueName [%s]", tag.name, valueName));
    for (var i = 0; i < tag.values.length; i++) {
      if (tag.values[i].name == valueName) {
        return tag.values[i];
      }
    }

    return null;
  };

  var getVariant = function(value, variantName) {
    winston.debug(sprintf("Searching in value [%s] for variantName [%s]", value.name, variantName));
    for (var i = 0; i < value.variants.length; i++) {
      if (value.variants[i].name == variantName) {
        return value.variants[i];
      }
    }

    return null;
  };
}
