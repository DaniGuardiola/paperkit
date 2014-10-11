/*
* Rework Materializer plugin
*/

var rework=require('rework');
var walk=require('rework-walk');

module.exports= Materializer;

function Materializer(mdcssData) {
  if (!(this instanceof Materializer)) return new Materializer(mdcssData);

  var mdcssObjectsMap = {};

  // Density equals
  var mdipConvertionMap = {
    'ldpi'    : [ "(max-resolution: 140dpi)", 0.75 ],
    'mdpi'    : [ "(min-resolution: 140dpi) and (max-resolution: 180dpi)", 1.0 ],
    'hdpi'    : [ "(min-resolution: 180dpi) and (max-resolution: 280dpi)", 1.5 ],
    'xhdpi'   : [ "(min-resolution: 280dpi) and (max-resolution: 400dpi)", 2.0 ],
    'xxhdpi'  : [ "(min-resolution: 400dpi) and (max-resolution: 560dpi)", 3.0 ],
    'xxxhdpi' : [ "(min-resolution: 560dpi)", 4.0 ],
  };

  rework(mdcssData)
    .use(function(style) {
      walk(style, function(rule) {
        if(rule.selectors) {
          rule.selectors.forEach(function(selector) {
            var sel = selector.match(/\[(.*=.*:?)\]/);
            if(sel) {
              // console.log("FOUND =>" + sel[1]);
              if(sel[1] in mdcssObjectsMap) {
                // console.log("DUPLICATED!!!" + sel[1]);
              }
              mdcssObjectsMap[sel[1]]=rule.declarations;
            }
          });
        }
      });
    });

  this.mdcssProcessor= function(ast, rework) {
    processRules(ast.rules);
  };

  this.dipProcessor= function(ast, rework) {
    var generatedRules = processDIP(ast.rules);
    ast.rules = ast.rules.concat(generatedRules);
  }

  var processRules= function(rules, media) {
    var mediaRules = [];

    if(!media) {
      media = {
        type: "media",
        media: "all",
        rules: rules
      }
    }

    rules.forEach(function(rule) {
      if(rule.rules) {
        mediaRules.push(rule);
      } else {
        var editedDeclarations = [];

        rule.declarations.forEach(function(declaration) {
          var fullProperty = declaration.property+"="+declaration.value;
          var mdcssProperty = mdcssObjectsMap[fullProperty];

          if(mdcssProperty) {
            editedDeclarations.push({ type: "comment", comment: " BEGIN: " + fullProperty + " "});
            editedDeclarations = editedDeclarations.concat(mdcssProperty);
            editedDeclarations.push({ type: "comment", comment: " END: " + fullProperty + " "});
          } else {
            editedDeclarations.push(declaration);
          }
        });

        rule.declarations = editedDeclarations;
      }
    });


    mediaRules.forEach(function(mediaRule) {
      processRules(mediaRule.rules, mediaRule);
    });
  };

  var processDIP= function(rules, media) {
    var mediaRules = [];
    var generatedRules = [];

    for(var key in mdipConvertionMap) {
      if(key != "mdpi") {
        var genMedia = {
          type: "media",
          "media": (media ? media.media : "all") + " and " + mdipConvertionMap[key][0],
          rules: []
        }

        var genRule = {};

        rules.slice(0).forEach(function(rule) {
          if(!rule.rules) {
            genRule = JSON.parse(JSON.stringify(rule));

            if(rule.declarations) {
              genRule.declarations = [];

              rule.declarations.forEach(function(declaration){
                if(declaration.value && declaration.value.indexOf("dip") > -1) {
                  var genDeclaration = JSON.parse(JSON.stringify(declaration));
                  var value = parseInt(genDeclaration.value);
                  value = value * mdipConvertionMap[key][1];
                  genDeclaration.value = value + "px";
                  genRule.declarations.push(genDeclaration);
                }
              });

              if(genRule.declarations) {
                genMedia.rules.push(genRule);
              }
            }
          }
        });

        if(genMedia.rules.length > 0) {
          generatedRules.push(genMedia);
        }
      }
    }

    rules.forEach(function(rule) {
      if(rule.declarations) {
        rule.declarations.forEach(function(declaration) {
          if(declaration.value && declaration.value.indexOf("dip") > -1) {
            declaration.value = declaration.value.replace("dip", "px");
          }
        });
      }
    });

    rules.forEach(function(rule){
      if(rule.rules) {
        generatedRules = generatedRules.concat(processDIP(rule.rules, rule));
      }
    });

    return generatedRules;
  }
}

Materializer.prototype.process = function(cssData) {
  this.rework=rework(cssData);
  this.rework.use(this.mdcssProcessor);
  this.rework.use(this.dipProcessor);
  return this.rework.toString();
}
