var winston = require('winston');
var sprintf = require('sprintf');
var css = require('css');

// winston.level='debug';

module.exports = Generator;

function Generator(jsonData, jsonConfig, imports) {
  var jsonData = JSON.parse(jsonData);
  var jsonConfig = JSON.parse(jsonConfig);

  var generatedCSS = {
    'type': 'stylesheet',
    'stylesheet': {
      'rules': []
    }
  };

  var generatedMedias = [];

  /**
   * Generates a CSS string,
   * taking a materializer json file as input.
   * @return {string} CSS string
   */
  this.generate = function() {
    if (jsonData.type === "tag") {
      processTag(jsonData);
    } else if (jsonData.type === "attribute") {
      processAttribute(jsonData);
    }

    // Add all generated medias
    generatedMedias.forEach(function(media) {
      generatedCSS.stylesheet.rules.push(media);
    });

    winston.debug("GENERATED CSS => " + JSON.stringify(generatedCSS, null, 2));
    return css.stringify(generatedCSS);
  }

  /**
   * Process a materializer tag object.
   * @param  {object} tag materializer tag object
   */
  var processTag = function(tag) {
    var tagselectors = [];

    if (!('names' in tag)) {
      tag.names = [];
      tag.names.push(tag.name);
      if ('alias' in tag) {
        tag.names = tag.names.concat(tag.alias);
      }
    }

    // Generate tag selectors for tag names
    tag.names.forEach(function(name) {
      var selector = {
        "name": name
      };
      tagselectors.push(selector);
    });

    // Generate TAG css
    if ('css' in tag) {
      generatedCSS.stylesheet.rules.push(generateRule(tagselectors, tag.css));
    }

    // Generate TAG medias
    if ('responsive' in tag) {
      processResponsive(tagselectors, tag.responsive);
    }

    // Generate TAG attributes
    if ('attributes' in tag) {
      tag.attributes.forEach(function(attribute) {
        processAttribute(attribute, tagselectors, ('defaults' in tag) ? tag.defaults : null);
      });
    }

    // Generate TAG fixes
    if ('fixes' in tag) {
      processFixes(tagselectors, tag.fixes);
    }
  }

  /**
   * Process a materializer attribute object.
   * @param  {object} attribute Materializer attribute object.
   * @param  {array} tagselectors Array of tag selectors that own this attribute.
   */
  var processAttribute = function(attribute, tagSelectors, defaults) {
    var attributeSelectors = [];

    // Generate attribute selectors
    if (tagSelectors) {
      tagSelectors.forEach(function(tagSelector) {
        var attributeSelector = JSON.parse(JSON.stringify(tagSelector));
        if (defaults) {
          if ((def = inDefaults(defaults, attribute.name))) {
            if (!def.values) {
              attributeSelectors.push(JSON.parse(JSON.stringify(tagSelector)));
            }
          }
        }
        attributeSelector.attribute = attribute.name;
        attributeSelectors.push(attributeSelector);
      });
    } else {
      attributeSelectors.push({
        "attribute": attribute.name
      });
    }

    // Process CSS in attribute
    if ('css' in attribute) {
      generatedCSS.stylesheet.rules.push(generateRule(attributeSelectors, attribute.css));
    }

    // Process fixes in attribute
    if ('fixes' in attribute) {
      processFixes(attributeSelectors, attribute.fixes);
    }

    // Process attribute values
    if ('values' in attribute) {
      processValues(attribute.values, attribute, tagSelectors, defaults);
    }

    if ('imports' in attribute) {
      processImports(attribute.imports, attribute, tagSelectors, defaults);
    }

    // Process responsive in attribute
    if ('responsive' in attribute) {
      processResponsive(attributeSelectors, attribute.responsive);
    }
  }

  /**
   * Process a set of imports in an attribute
   * @param  {array} imports      Array of attribute imports to process
   * @param  {object} attribute    Attribute object
   * @param  {array} tagSelectors Array of tagSelectors if this attribute is inside a tag
   * @param  {array} defaults     Array of default values if this attribute is inside a tag
   */
  processImports = function(imports, attribute, tagSelectors, defaults) {
    imports.forEach(function(valueImport) {
      var importObject = findImport(valueImport.name);
      var values = [];

      importObject.values.forEach(function(importValue) {
        var value = {};
        value.name = importValue.name;

        if ('value1' in importValue || 'value2' in importValue) {
          value.css = [];

          if ('value1' in importValue && 'property1' in valueImport) {
            value.css.push({
              "property": valueImport.property1,
              "value": importValue.value1
            });
          }

          if ('value2' in importValue && 'property2' in valueImport) {
            value.css.push({
              "property": valueImport.property2,
              "value": importValue.value2
            });
          }
        }

        if ('variants' in importValue) {
          value.variants = [];

          if ('defaultVariant' in importValue) {
            value.defaultVariant = importValue.defaultVariant;
          }

          importValue.variants.forEach(function(importVariant) {
            var variant = {};
            variant.name = importVariant.name;
            variant.css = [];

            if ('value1' in importVariant && 'property1' in valueImport) {
              variant.css.push({
                "property": valueImport.property1,
                "value": importVariant.value1
              });
            }

            if ('value2' in importVariant && 'property2' in valueImport) {
              variant.css.push({
                "property": valueImport.property2,
                "value": importVariant.value2
              });
            }

            value.variants.push(variant);
          });
        }

        values.push(value);
      });

      processValues(values, attribute, tagSelectors, defaults);
    });
  }

  /**
   * Process a set of values in an attribute
   *
   * @param  {array} values 			Array of attribute value objects
   * @param  {object} attribute   Attribute object that contains the values
   * @param  {array} tagSelectors Array of tag selectors if this attribute is inside a tag
   * @param  {array} defaults    Array of default values if this attribute is inside a tag
   */
  var processValues = function(values, attribute, tagSelectors, defaults) {
    values.forEach(function(value) {
      var attributeSelectors = [];

      if (tagSelectors) {
        tagSelectors.forEach(function(tagSelector) {
          var attributeSelector = JSON.parse(JSON.stringify(tagSelector));
          attributeSelector.attribute = attribute.name;
          attributeSelector.value = value.name;

          if (defaults) {
            if ((def = inDefaults(defaults, attribute.name))) {
              if (def.values.indexOf(value.name) != -1) {
                attributeSelectors.push(JSON.parse(JSON.stringify(tagSelector)));
              }
            }
          }
          attributeSelectors.push(JSON.parse(JSON.stringify(attributeSelector)));
        });
      } else {
        var attributeSelector = {
          "attribute": attribute.name,
          "value": value.name
        };
        attributeSelectors.push(JSON.parse(JSON.stringify(attributeSelector)));
      }

      // Generate value CSS
      if ('css' in value) {
        generatedCSS.stylesheet.rules.push(generateRule(attributeSelectors, value.css));
      }

      // Process fixes in value
      if ('fixes' in value) {
        processFixes(JSON.parse(JSON.stringify(attributeSelectors)), value.fixes);
      }

      // Process value variants
      if ('variants' in value) {
        value.variants.forEach(function(variant) {
          var variantsSelectors = [];
          attributeSelectors.forEach(function(attributeSelector, index) {
            var selector = JSON.parse(JSON.stringify(attributeSelector));
            selector.variantName = variant.name;

            if (defaults) {
              if ((def = inDefaults(defaults, attribute.name))) {
                winston.debug("FOUND DEFAULT ATTRIBUTE => " + JSON.stringify(def));
                if (def.values.indexOf(value.name + "-" + variant.name) != -1) {
                  var defaultTagSelector = tagSelectors[index];
                  winston.debug("DEFAULT SELECTOR => " + JSON.stringify(defaultTagSelector));
                  variantsSelectors.push(defaultTagSelector);
                }
              }
            }

            if (value.defaultVariant == variant.name) {
              var defaultSelector = attributeSelectors[index];
              winston.debug("DEFAULT VARIANT SELECTOR => " + JSON.stringify(defaultSelector));
              variantsSelectors.push(JSON.parse(JSON.stringify(defaultSelector)));
            }

            variantsSelectors.push(selector);
          });

          // Generate CSS in variant
          if ('css' in variant) {
            generatedCSS.stylesheet.rules.push(generateRule(variantsSelectors, variant.css));
          }

          // Process responsive in variant
          if ('responsive' in variant) {
            processResponsive(variantsSelectors, variant.responsive);
          }
        });
      }

      // Process responsive in value
      if ('responsive' in value) {
        processResponsive(attributeSelectors, value.responsive);
      }
    });
  }

  /**
   * Process a materializer fixes array
   * @param  {array} selectors array of selectors affected by this fixes
   * @param  {array} fixes     array of fixes to process
   */
  var processFixes = function(selectors, fixes) {
    for (var i = 0; i < fixes.length; i++) {
      var fix = fixes[i];

      selectors.forEach(function(selector) {
        selector.before = ('before' in fix) ? fix.before : "";
        selector.after = ('after' in fix) ? fix.after : "";
      });

      if ('css' in fix) {
        generatedCSS.stylesheet.rules.push(generateRule(selectors, fix.css));
      }

      if ('attributes' in fix) {
        fix.attributes.forEach(function(attribute) {
          processAttribute(attribute, selectors);
        });
      }

      if ('responsive' in fix) {
        processResponsive(selectors, fix.responsive);
      }
    }
  }

  /**
   * Process a materializer responsive array.
   * @param  {array} selectors   array of selectors affected by this responsives
   * @param  {array} responsives array of responsive elements to process
   */
  var processResponsive = function(selectors, responsives) {
    var responsiveSelectors = [];

    selectors.forEach(function(selector) {
      var responsiveSelector = JSON.parse(JSON.stringify(selector));
      responsiveSelector.noresponsive = 1;
      responsiveSelectors.push(responsiveSelector);
    });

    for (var i = 0; i < responsives.length; i++) {
      var responsive = responsives[i];
      var mediaquery = getMediaQuery(responsive.target).join(",\n");
      var existingMedia = getExistingMedia(mediaquery);
      existingMedia.rules.push(generateRule(responsiveSelectors, responsive.css));
    }
  }

  /* ------- GENERIC FUNCTIONS  ------- */

  /**
   * Finds an import object by its name
   * @param  {string} importName Name of the import to search for
   * @return {object}            Materializer import object
   */
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


  /**
   * Returs the defaults that match the import name
   * @param  {array} defaults  	Defaults array
   * @param  {string} name 			Import name to search for
   * @return {object}           Default that matches the name or null
   */
  var inDefaults = function(defaults, name) {
    var inDefault = null;
    defaults.some(function(def) {
      if (def.name === name) {
        inDefault = def;
        return true;
      }
    })
    return inDefault;
  }

  /**
   * Returns a media query from a materializer target element.
   * @param  {array} target array of materializer json targets
   * @return {array}        array of css mediaqueries
   */
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

  /**
   * Returns the already generated parse-css media object, or a new one, for
   * the mediaquery received.
   * @param  {string} mediaquery Media query to search for.
   * @return {[type]}            [description]
   */
  var getExistingMedia = function(mediaquery) {
    // Search for an already generated media and return it.
    for (var i = 0; i < generatedMedias.length; i++) {
      var generatedMedia = generatedMedias[i];
      if (generatedMedia.media == mediaquery) {
        return generatedMedia;
      }
    }

    // No one found, generate a new one...
    var generatedMedia = {
      "type": "media",
      "media": mediaquery,
      "rules": []
    };
    generatedMedias.push(generatedMedia);
    return generatedMedia;
  }

  /**
   * Generates a parse-css rule
   * @param  {array} selectors array of selector objects.
   * @param  {array} css       array of materializer css rules
   * @return {object}          parse-css rule @see{url https://github.com/reworkcss/css}
   */
  var generateRule = function(selectors, css) {
    var rule = {
      'type': 'rule',
      'selectors': [],
      'declarations': []
    };

    selectors.forEach(function(selector) {
      rule.selectors.push(generateSelector(selector));
    });

    css.forEach(function(cssDeclaration) {
      rule.declarations.push(generateCSS(cssDeclaration));
    });

    return rule;
  }

  /**
   * Generates a parse-css declaration from a materializer json css rule.
   * @param  {object} css materializer json css rule
   * @return {object}     parse-css declaration @see{url https://github.com/reworkcss/css}
   */
  var generateCSS = function(css) {
    css.type = 'declaration';
    return css;
  }

  /**
   * Generates a selector string.
   * @param  {object} selector materializer selector
   * @return {string}          css style selector string.
   */
  var generateSelector = function(selector) {
    var selectorString = "";
    selectorString += ('before' in selector) ? selector.before : "";
    selectorString += ('name' in selector) ? selector.name : "";
    selectorString += ('attribute' in selector) ? "[" + selector.attribute : "";
    selectorString += ('value' in selector) ? "~=" + selector.value : "";
    selectorString += ('variantName' in selector) ? "-" + selector.variantName + "]" : ('attribute' in selector) ? "]" : "";
    selectorString += ('noresponsive' in selector) ? generateNoResponsiveSelector(selector) : "";
    selectorString += ('after' in selector) ? selector.after : "";
    return selectorString;
  }

  var generateNoResponsiveSelector = function(selector) {
    var selectorString = "";
    selectorString += ('attribute' in selector) ? ":not([" + selector.attribute + "$=noresponsive])" : "";
    selectorString += ":not([noresponsive])";
    return selectorString;
  }
}
