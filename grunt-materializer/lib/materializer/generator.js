var winston = require('winston')
var sprintf = require('sprintf')
var css = require('css')

module.exports = Generator;

function Generator(jsonData) {
  var jsonData = JSON.parse(jsonData);

  function Rule() {
    this.type = "rule";
    this.selectors = [];
    this.declarations = [];
  };

  function Declaration() {
    this.type = "declaration";
    this.property = "";
    this.value = "";
  }

  function Media() {
    this.type = "media";
    this.media = "";
    this.rules = [];
  }

  var generatedMedias = [];

  this.generate = function() {
    var generatedData = [];

    jsonData.values.forEach(function(value) {
      if ('css' in value) {
        generatedData.push(generateRule(value.css, jsonData.name, value.name));
      }

      if ('variants' in value) {
        value.variants.forEach(function(variant) {
          if ('css' in variant) {
            generatedData.push(generateRule(variant.css, jsonData.name, value.name, variant.name, value.defaultVariant));
          }
        });
      }

      if ('responsive' in value) {
        value.responsive.forEach(function(responsive) {
          generateMedia(responsive, jsonData.name, value.name);
        });
      }

      if ('variants' in value) {
        value.variants.forEach(function(variant) {
          if ('responsive' in variant) {
            variant.responsive.forEach(function(responsive) {
              generateMedia(responsive, jsonData.name, value.name, variant.name, false);
            });
          }
        });
      }
    });

    winston.debug(sprintf("GENERATED DATA => %s", JSON.stringify(generatedData, null, 2)));

    var cssObject = {
      "type": "stylesheet",
      "stylesheet": {
        "rules": generatedData.concat(generatedMedias)
      }
    };

    return css.stringify(cssObject);
  };

  var generateRule = function(css, tagname, valuename, variantname, defaultVariant) {
    var rule = new Rule();
    var ruleSelector = sprintf("[%s^=%s]", tagname, valuename);

    // Generate rule selectors
    if (variantname) {
      if (defaultVariant && defaultVariant == variantname) {
        winston.debug("VARIANT => " + variantname + " DEFAULT => " + defaultVariant);
        rule.selectors.push(ruleSelector);
      }
      ruleSelector += sprintf("[%s~=%s]", tagname, variantname);
    }
    rule.selectors.push(ruleSelector);

    // Generate rule declarations
    css.forEach(function(cssValue) {
      cssValue['type'] = "declaration";
      rule.declarations.push(cssValue);
    });

    return rule;
  };

  var generateMedia = function(responsive, tagname, valuename, variantname) {
    responsive.target.forEach(function(target) {
      var media = getMedia(target);
      winston.debug(sprintf("FOUND MEDIA => %s", target));
      if (!media) {
        media = new Media();
        media.media = target;
        media.rules = [];
        generatedMedias.push(media);
      }

      var rule = generateRule(responsive.css, tagname, valuename, variantname, false);
      rule.selectors.forEach(function(selector, index, array) {
        array[index] = selector + ":not([md-typo$=noresponsive])";
        winston.debug("CHANGED SELECTOR TO ==> " + selector);
      });
      media.rules.push(rule);
    });
  };

  var getMedia = function(mediaName) {
    winston.debug(sprintf("SEARCHING FOR MEDIA => %s", mediaName));
    for (var i = 0; i < generatedMedias.length; i++) {
      var generatedMedia = generatedMedias[i];
      winston.debug(sprintf("MEDIA IN ARRAY => %s", generatedMedia.media));
      if (generatedMedia.media == mediaName) {
        winston.debug(sprintf("FOUND!!!!"));
        return generatedMedia;
      }
    }

    return null;
  };
}
