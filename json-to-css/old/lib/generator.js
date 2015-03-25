var winston = require('winston');
var sprintf = require('sprintf');
var css = require('css');

// winston.level = 'debug';

module.exports = Generator;

function Generator(jsonData, jsonConfig, imports) {
  if (jsonData) {
    var jsonData = JSON.parse(jsonData);
  }

  if (jsonConfig) {
    var jsonConfig = JSON.parse(jsonConfig);
  }

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

    if ('type' in jsonData) {
      winston.debug(sprintf("JSON TYPE => %s", jsonData.type));
      if (jsonData.type == 'tag') {
        generatedData = generatedData.concat(generateTag(jsonData, null));
      } else if (jsonData.type == 'attribute') {
        generatedData = generatedData.concat(generateAttribute(jsonData));
      }
    }
    // winston.debug(sprintf("SOURCE DATA => %s", JSON.stringify(jsonData, null, 2)));
    // winston.debug(sprintf("GENERATED DATA => %s", JSON.stringify(generatedData, null, 2)));

    var cssObject = {
      "type": "stylesheet",
      "stylesheet": {
        "rules": generatedData.concat(generatedMedias)
      }
    };

    return css.stringify(cssObject);
  };

  var generateTag = function(tag, parentTag) {
    var generatedData = [];

    if (parentTag) {
      if (parentTag.alias) {
        var allNames = parentTag.alias.slice(0);
        allNames.unshift(parentTag.name);
      } else {
        var allNames = [parentTag.name];
      }
    } else {
      var allNames = [tag.name];
    }

    winston.debug("GENERATING TAG FOR " + JSON.stringify(allNames));

    for (var i = 0; i < allNames.length; i++) {
      var name = (tag.before ? tag.before : "") + allNames[i] + (tag.after ? tag.after : "");
      winston.debug("TAG NAME " + name);

      if ('css' in tag) {
        generatedData.push(generateRule(tag.css, name, null, null, null, null, null, null, null, null, tag.alias));
      }

      /* Render first tag responsive, then attributes responsive */
      if ('responsive' in tag) {
        tag.responsive.forEach(function(responsive) {
          generateMedia(responsive, name, null, null, null, null, null, null, tag.alias);
        });
      }

      if ('attributes' in tag) {
        tag.attributes.forEach(function(attribute) {
          var defaults = ('defaults' in tag) ? tag.defaults : null;
          winston.debug("GOING TO CALL GENERATE ATTRIBUTE WITH DEFAULTS => " + JSON.stringify(defaults));
          generatedData = generatedData.concat(generateAttribute(attribute, name, defaults, tag.alias));
        });
      }

      /* 
       * Still supported but deprecated
       */
      if (('fixes' in tag) && !parentTag) {
        winston.debug('FIXES FOUND!');

        tag.fixes.forEach(function(fix) {
          winston.debug(sprintf("PROCESSING FIX %s", JSON.stringify(fix, null, 2)));
          generatedData = generatedData.concat(generateTag(fix, tag));

        });
      }
    }

    return generatedData;
  }

  var generateAttribute = function(attribute, tagname, defaultAttributes, alias) {
    winston.debug("GENERATING ATTRIBUTE FOR TAGNAME " + tagname + " WITH ALIAS " + JSON.stringify(alias) + " AND DEFAULTS " + JSON.stringify(defaultAttributes));
    var generatedData = [];

    if ('css' in attribute) {
      generatedData.push(generateRule(attribute.css, tagname, attribute.name, null, null, null, defaultAttributes, null, null, null, alias));
    }

    if ('imports' in attribute) {
      attribute.imports.forEach(function(valueImport) {
        var _import = findImport(valueImport.name);

        if ('values' in _import) {
          _import.values.forEach(function(value) {
            if ('variants' in value) {
              winston.debug(sprintf("PROCESSING IMPORT => %s", JSON.stringify(value, null, 2)));
              value.variants.forEach(function(variant) {
                var css = [];
                if (variant.value1 && valueImport.property1) {
                  css.push(generateCSS(valueImport.property1, variant.value1));
                }

                if (variant.value2 && valueImport.property2) {
                  css.push(generateCSS(valueImport.property2, variant.value2));
                }
                winston.debug(sprintf("GENERATED CSS FROM IMPORT => %s", JSON.stringify(css, null, 2)));
                if (css.length > 0) {
                  generatedData.push(generateRule(css, tagname, attribute.name, value.name, variant.name, value.defaultVariant, defaultAttributes, null, null, null, alias));
                }
              });
            } else {
              winston.debug(sprintf("PROCESSING IMPORT VALUE => %s", JSON.stringify(value, null, 2)));
              var css = [];
              if (value.value1 && valueImport.property1) {
                css.push(generateCSS(valueImport.property1, value.value1));
              }

              if (value.value2 && valueImport.property2) {
                css.push(generateCSS(valueImport.property2, value.value2));
              }
              winston.debug(sprintf("GENERATED CSS FROM IMPORT => %s", JSON.stringify(css, null, 2)));
              if (css.length > 0) {
                generatedData.push(generateRule(css, tagname, attribute.name, value.name, null, null, defaultAttributes, null, null, null, alias));
              }
            }
          });
        }
      });
    }


    if ('values' in attribute) {
      attribute.values.forEach(function(value) {
        if ('css' in value) {
          generatedData.push(generateRule(value.css, tagname, attribute.name, value.name, null, null, defaultAttributes, null, null, null, alias));
        }

        if ('variants' in value) {
          value.variants.forEach(function(variant) {
            if ('css' in variant) {
              generatedData.push(generateRule(variant.css, tagname, attribute.name, value.name, variant.name, value.defaultVariant, defaultAttributes, null, null, null, alias));
            }
          });
        }

        /*
         * REVISAR...
         */
        if ('fixes' in value) {
          value.fixes.forEach(function(fix) {
            if ('css' in fix) {
              generatedData.push(generateRule(fix.css, tagname, attribute.name, value.name, null, null, defaultAttributes, null, fix.before, fix.after, alias));
            }

            if ('responsive' in fix) {
              fix.responsive.forEach(function(responsive) {
                generateMedia(responsive, tagname, attribute.name, value.name, null, defaultAttributes, fix.before, fix.after, alias);
              });
            }
          });
        }

        if ('responsive' in value) {
          value.responsive.forEach(function(responsive) {
            generateMedia(responsive, tagname, attribute.name, value.name, null, defaultAttributes, null, null, alias);
          });
        }

        if ('variants' in value) {
          value.variants.forEach(function(variant) {
            if ('responsive' in variant) {
              variant.responsive.forEach(function(responsive) {
                generateMedia(responsive, tagname, attribute.name, value.name, variant.name, defaultAttributes, null, null, alias);
              });
            }
          });
        }
      });
    }

    return generatedData;
  }

  var findImport = function(importName) {
    winston.debug(sprintf("SEARCHING FOR IMPORT => %s in %s", importName, JSON.stringify(imports, null, 2)));
    if (!imports) {
      return null;
    }
    var returnImport = null;
    imports.some(function(_import) {
      winston.debug(sprintf("LOCATED IMPORT %s", _import.name));
      if (_import.name === importName) {
        winston.debug("FOUND!!!");
        returnImport = _import;
        return true;
      }
    });

    return returnImport;
  }

  var generateFix = function(fix) {

  }

  var generateCSS = function(attribute, value) {
    return {
      'property': attribute,
      'value': value
    };
  }

  var generateRule = function(css, tagname, attributename, valuename, variantname, defaultVariant, defaultAttributes, responsive, before, after, alias) {
    var rule = new Rule();

    if (alias) {
      var allAlias = alias.slice(0);
      allAlias.unshift(tagname);
    } else {
      var allAlias = [tagname];
    }

    for (var i = 0; i < allAlias.length; i++) {
      tagname = allAlias[i];
      winston.debug("GENERATING RULE FOR ALIAS => " + tagname + " WITH DEFAULTS => " + JSON.stringify(defaultAttributes));

      if (before) {
        rule.selectors.push();
      }

      // Generate tag defaults rule selectors
      if (tagname && defaultAttributes) {
        defaultAttributes.forEach(function(defaultAttribute) {
          if (attributename && defaultAttribute.name == attributename) {
            defaultAttribute.values.forEach(function(value) {
              if (!valuename || (!variantname && valuename == value) || (variantname && valuename + "-" + variantname == value)) {
                winston.debug(sprintf("ATTRIBUTE: %s VALUE: %s VARIANT: %s DEFAULT: %s", attributename, valuename, variantname, value));
                rule.selectors.push(getSelector(tagname, null, null, null, responsive, before, after));
              }
            });
          }
        })
      }

      // generate default variant selector    
      if (variantname && defaultVariant && defaultVariant == variantname) {
        rule.selectors.push(getSelector(tagname, attributename, valuename, null, responsive, before, after));
      }


      // generate rule selectors
      rule.selectors.push(getSelector(tagname, attributename, valuename, variantname, responsive, before, after));
    }

    // Generate rule declarations
    css.forEach(function(cssValue) {
      cssValue['type'] = "declaration";
      rule.declarations.push(cssValue);
    });

    return rule;
  };

  var generateMedia = function(responsive, tagname, attributename, valuename, variantname, defaultAttributes, before, after, alias) {
    var mediaquery = getMediaQuery(responsive.target).join(",\n");
    var media = getMedia(mediaquery);
    winston.debug(sprintf("FOUND MEDIA => %s", media));

    if (!media) {
      media = new Media();
      media.media = mediaquery;
      media.rules = [];
      generatedMedias.push(media);
    }

    var rule = generateRule(responsive.css, tagname, attributename, valuename, variantname, false, defaultAttributes, true, before, after, alias);
    media.rules.push(rule);
  };

  var getMediaQuery = function(target) {
    var mediaquery = [];

    target.forEach(function(target) {
      if (jsonConfig && ('responsive' in jsonConfig)) {
        jsonConfig.responsive.forEach(function(responsive) {
          if (target == responsive.name) {
            if ('media' in responsive) {
              mediaquery.push(responsive.media);
            }

            if ('include' in responsive) {
              mediaquery = mediaquery.concat(getMediaQuery(responsive.include));
            }
          }
        })
      }
    });

    if (mediaquery == "") {
      mediaquery = [target.join(",")];
    }

    return mediaquery;
  }

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

  var getSelector = function(tagname, attrname, valuename, variantname, responsive, before, after) {
    var selector = [];

    if (before) {
      selector.push(before);
    }

    if (tagname) {
      selector.push(tagname);
    }

    if (attrname && valuename) {
      selector.push(sprintf("[%s~=%s%s]", attrname, valuename, (variantname ? "-" + variantname : "")));
    } else if (attrname) {
      selector.push(sprintf("[%s]", attrname));
    }

    if (responsive) {
      if (attrname) {
        selector.push(sprintf(":not([%s$=noresponsive]):not([noresponsive])", attrname));
      } else {
        selector.push(":not([noresponsive])");
      }
    }

    if (after) {
      selector.push(after);
    }

    var stringSelector = selector.join("");

    return stringSelector;
  }
}
