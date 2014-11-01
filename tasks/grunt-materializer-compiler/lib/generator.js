var winston = require('winston');
var sprintf = require('sprintf');
var css = require('css');

module.exports = Generator;

function Generator(jsonData, jsonConfig) {
  if(jsonData) {
    var jsonData=JSON.parse(jsonData);
  }

  if(jsonConfig) {
    var jsonConfig = JSON.parse(jsonConfig);
  }

  function Rule() {
    this.type="rule";
    this.selectors=[];
    this.declarations=[];
  };

  function Declaration() {
    this.type="declaration";
    this.property = "";
    this.value = "";
  }

  function Media() {
    this.type="media";
    this.media="";
    this.rules=[];
  }

  var generatedMedias = [];

  this.generate = function() {
    var generatedData = [];  

    if('type' in jsonData) {
      winston.debug(sprintf("JSON TYPE => %s", jsonData.type));
      if(jsonData.type=='tag') {
        generatedData = generatedData.concat(generateTag(jsonData));
      } else if(jsonData.type=='attribute') {
        generatedData = generatedData.concat(generateAttribute(jsonData));
      }
    }

    winston.debug(sprintf("GENERATED DATA => %s", JSON.stringify(generatedData, null, 2)));

    var cssObject = {
      "type": "stylesheet",
      "stylesheet": {
        "rules": generatedData.concat(generatedMedias)
      }
    };

    return css.stringify(cssObject);
  };

  var generateTag= function(tag) {
    var generatedData = [];

    if('css' in tag) {
      generatedData.push(generateRule(tag.css, tag.name));
    }

    if('responsive' in tag) {
      tag.responsive.forEach(function(responsive) {
        generateMedia(responsive, tag.name);
      });
    }

    if('attributes' in tag) {
      tag.attributes.forEach(function(attribute){
        generatedData = generatedData.concat(generateAttribute(attribute, tag.name, (('defaults' in tag) ? tag.defaults: null)));
      });    
    }

    return generatedData;
  }

  var generateAttribute= function(attribute, tagname, defaultAttributes) {
    var generatedData = [];

    if('values' in attribute) {
      attribute.values.forEach(function(value) {
        if('css' in value) {
          generatedData.push(generateRule(value.css, tagname, attribute.name, value.name, null, null, defaultAttributes));  
        }        

        if('variants' in value) {
          value.variants.forEach(function(variant) {
            if('css' in variant) {
              generatedData.push(generateRule(variant.css, tagname, attribute.name, value.name, variant.name, value.defaultVariant, defaultAttributes));
            }          
          });
        }

        if('responsive' in value) {
          value.responsive.forEach(function(responsive) {
            generateMedia(responsive, tagname, attribute.name, value.name, null, defaultAttributes);
          });
        }

        if('variants' in value) {
          value.variants.forEach(function(variant) {
            if('responsive' in variant) {
              variant.responsive.forEach(function(responsive) {
                generateMedia(responsive, tagname, attribute.name, value.name, variant.name, defaultAttributes);
              });            
            }          
          });
        }
      });
    }

    return generatedData;
  }

  var generateRule = function(css, tagname, attributename, valuename, variantname, defaultVariant, defaultAttributes, responsive) {
    var rule = new Rule(); 

    // Generate rule selectors
    if(tagname && defaultAttributes) {
      defaultAttributes.forEach(function(defaultAttribute) {
        if(attributename && defaultAttribute.name==attributename) {
          if(!valuename || defaultAttribute.value==valuename) {
            if(!variantname || !('variant' in defaultAttribute) || defaultAttribute.variant==variantname) {
              rule.selectors.push(getSelector(tagname, null, null, null, responsive));    
            }
          }
        }
      })
    }

    if(variantname && defaultVariant && defaultVariant==variantname) {
      rule.selectors.push(getSelector(tagname, attributename, valuename, null, responsive));
    }
    rule.selectors.push(getSelector(tagname, attributename, valuename, variantname, responsive));

    // Generate rule declarations
    css.forEach(function(cssValue) {
      cssValue['type'] = "declaration";
      rule.declarations.push(cssValue);
    });

    return rule;
  };

  var generateMedia=function(responsive, tagname, attributename, valuename, variantname, defaultAttributes) {
    responsive.target.forEach(function(target) {
      var mediaquery = getMediaQuery(target).join(",\n");  
      var media = getMedia(mediaquery);
      winston.debug(sprintf("FOUND MEDIA => %s", target));
      
      if(!media) {
        media = new Media();
        media.media = mediaquery;
        media.rules = [];
        generatedMedias.push(media);
      }

      var rule = generateRule(responsive.css, tagname, attributename, valuename, variantname, false, defaultAttributes, true);
      media.rules.push(rule);
    });
  };

  var getMediaQuery= function(target) {
    var mediaquery = [];

    if(jsonConfig && ('responsive' in jsonConfig)) {
      jsonConfig.responsive.forEach(function(responsive) {
        if(target==responsive.name) {
          if('media' in responsive) {
            mediaquery.push(responsive.media);
          }

          if ('include' in responsive) {
            responsive.include.forEach(function(include) {
              mediaquery = mediaquery.concat(getMediaQuery(include));
            });            
          }
        }
      })
    } 

    if(mediaquery == "") {
      mediaquery = [ target ];
    }

    return mediaquery;
  }

  var getMedia=function(mediaName) {
    winston.debug(sprintf("SEARCHING FOR MEDIA => %s", mediaName));
    for(var i=0; i < generatedMedias.length; i++) {
      var generatedMedia=generatedMedias[i];
      winston.debug(sprintf("MEDIA IN ARRAY => %s", generatedMedia.media));
      if(generatedMedia.media==mediaName) {
        winston.debug(sprintf("FOUND!!!!"));
        return generatedMedia;
      }
    }

    return null;
  };

  var getSelector= function(tagname, attrname, valuename, variantname, responsive) {
    var selector = [];

    if(tagname) {
      selector.push(tagname);
    }

    if(attrname && valuename) {
      selector.push(sprintf("[%s*=%s%s]", attrname, valuename, (variantname ? "-"+variantname: "")));
    }

/*
    if(attrname && variantname) {
      selector.push(sprintf("[%s~=%s]", attrname, variantname));
    }
*/

    if(responsive) {
      if(attrname) {
        selector.push(sprintf(":not([%s$=noresponsive]):not([noresponsive])", attrname));
      } else {
        selector.push(":not([noresponsive])");
      }
      
    }

    var stringSelector = selector.join("");

    return stringSelector;
  }
}