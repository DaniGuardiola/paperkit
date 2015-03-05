/*
 * Rework Materializer plugin
 */

var rework = require('rework');
var walk = require('rework-walk');

module.exports = Materializer;

function Materializer(mdcssData) {
  if (!(this instanceof Materializer)) return new Materializer(mdcssData);

  var mdcssObjectsMap = {};

  // Density equals
  var mdipConvertionMap = {
    'ldpi': [
      ["(min-resolution: 120dpi) and (max-resolution: 160dpi)",
        "(-webkit-min-device-pixel-ratio: 0.75) and (-webkit-max-device-pixel-ratio: 1)",
        "(min--moz-device-pixel-ratio: 0.75) and (max--moz-device-pixel-ratio: 1)",
        "(-o-min-device-pixel-ratio: 0.75 / 1) and (-o-max-device-pixel-ratio: 1 / 1)",
        "(min-device-pixel-ratio: 0.75) and (max-device-pixel-ratio: 1)",
        "(min-resolution: 0.75dppx) and (max-resolution: 1.0dppx)"
      ], 0.75
    ],
    'mdpi': ["(min-resolution: 140dpi) and (max-resolution: 180dpi)", 1.0],
    'hdpi': [
      ["(min-resolution: 240dpi)",
        "(-webkit-min-device-pixel-ratio: 1.5)",
        "(min--moz-device-pixel-ratio: 1.5)",
        "(-o-min-device-pixel-ratio: 1.5 / 1)",
        "(min-device-pixel-ratio: 1.5)",
        "(min-resolution: 1.5dppx)"
      ], 1.5
    ],
    'xhdpi': [
      ["(min-resolution: 320dpi)",
        "(-webkit-min-device-pixel-ratio: 2.0)",
        "(min--moz-device-pixel-ratio: 2.0)",
        "(-o-min-device-pixel-ratio: 2.0 / 1)",
        "(min-device-pixel-ratio: 2.0)",
        "(min-resolution: 2.0dppx)"
      ], 2.0
    ],
    'xxhdpi': [
      ["(min-resolution: 480dpi)",
        "(-webkit-min-device-pixel-ratio: 3.0)",
        "(min--moz-device-pixel-ratio: 3.0)",
        "(-o-min-device-pixel-ratio: 3.0 / 1)",
        "(min-device-pixel-ratio: 3.0)",
        "(min-resolution: 3.0dppx)"
      ], 3.0
    ],
    'xxxhdpi': [
      ["(min-resolution: 640dpi)",
        "(-webkit-min-device-pixel-ratio: 4.0)",
        "(min--moz-device-pixel-ratio: 4.0)",
        "(-o-min-device-pixel-ratio: 4.0 / 1)",
        "(min-device-pixel-ratio: 4.0)",
        "(min-resolution: 4.0dppx)"
      ], 4.0
    ],
  };

  rework(mdcssData)
    .use(function(style) {
      walk(style, function(rule) {
        if (rule.selectors) {
          rule.selectors.forEach(function(selector) {
            var sel = selector.match(/\[(.*=.*:?)\]/);
            if (sel) {
              // console.log("FOUND =>" + sel[1]);
              if (sel[1] in mdcssObjectsMap) {
                // console.log("DUPLICATED!!!" + sel[1]);
              }
              mdcssObjectsMap[sel[1]] = rule.declarations;
            }
          });
        }
      });
    });

  this.mdcssProcessor = function(ast, rework) {
    processRules(ast.rules);
  };

  this.dipProcessor = function(ast, rework) {
    var generatedRules = processDIP(ast.rules);
    ast.rules = ast.rules.concat(generatedRules);
  }

  var processRules = function(rules, media) {
    var mediaRules = [];

    if (!media) {
      media = {
        type: "media",
        media: "all",
        rules: rules
      }
    }

    rules.forEach(function(rule) {
      if (rule.rules) {
        mediaRules.push(rule);
      } else {
        if (rule.declarations) {
          var editedDeclarations = [];

          rule.declarations.forEach(function(declaration) {
            var fullProperty = declaration.property + "=" + declaration.value;
            var mdcssProperty = mdcssObjectsMap[fullProperty];

            if (mdcssProperty) {
              editedDeclarations.push({
                type: "comment",
                comment: " BEGIN: " + fullProperty + " "
              });
              editedDeclarations = editedDeclarations.concat(mdcssProperty);
              editedDeclarations.push({
                type: "comment",
                comment: " END: " + fullProperty + " "
              });
            } else {
              editedDeclarations.push(declaration);
            }
          });

          rule.declarations = editedDeclarations;
        }
      }
    });


    mediaRules.forEach(function(mediaRule) {
      processRules(mediaRule.rules, mediaRule);
    });
  };

  var processDIP = function(rules, media) {
    var mediaRules = [];
    var generatedRules = [];

    for (var key in mdipConvertionMap) {
      if (key != "mdpi") {
        var genMedia = {
          type: "media",
          "media": generateMedia((media ? media.media : "all"), mdipConvertionMap[key][0]),
          rules: []
        }

        var genRule = {};

        rules.slice(0).forEach(function(rule) {
          if (!rule.rules) {
            genRule = JSON.parse(JSON.stringify(rule));

            if (rule.declarations) {
              genRule.declarations = [];

              rule.declarations.forEach(function(declaration) {
                if (declaration.value && declaration.value.indexOf("dip") > -1) {
                  var genDeclaration = JSON.parse(JSON.stringify(declaration));
                  genDeclaration.value = replaceDIPS(genDeclaration.value, mdipConvertionMap[key][1]);
                  genRule.declarations.push(genDeclaration);
                }
              });

              if (genRule.declarations && genRule.declarations.length > 0) {
                genMedia.rules.push(genRule);
              }
            }
          }
        });

        if (genMedia.rules.length > 0) {
          generatedRules.push(genMedia);
        }
      }
    }

    rules.forEach(function(rule) {
      if (rule.declarations) {
        rule.declarations.forEach(function(declaration) {
          if (declaration.value && declaration.value.indexOf("dip") > -1) {
            declaration.value = replaceDIPS(declaration.value, 1);
          }
        });
      }
    });

    rules.forEach(function(rule) {
      if (rule.rules) {
        generatedRules = generatedRules.concat(processDIP(rule.rules, rule));
      }
    });

    return generatedRules;
  }

  var generateMedia = function(original, mediaArray) {
    var generatedMedia = "";

    [].forEach.call(mediaArray, function(mediaValue) {
      if (!generatedMedia == "") {
        generatedMedia += ",\n"
      }

      generatedMedia += original + " and " + mediaValue;
    });

    return generatedMedia;
  }

  var replaceDIPS = function(value, factor) {
    var ocurrences = value.match(/\d+\s*dip/g);
    [].forEach.call(ocurrences, function(ocurrence) {
      var v = parseInt(ocurrence.replace("dip", ""));
      v = v * factor;
      value = value.replace(ocurrence, v + "px");
    });
    return value;
  }
}

Materializer.prototype.process = function(cssData) {
  console.log("Parsing MDCSS file...");
  this.rework = rework(cssData);
  console.log("Processing MDCSS properties...");
  this.rework.use(this.mdcssProcessor);
  console.log("Processing DIP units...");
  this.rework.use(this.dipProcessor);
  return this.rework.toString();
}
