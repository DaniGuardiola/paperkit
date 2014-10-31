/*
 * synonyms.js - PhantomJS script to get term definitions from Synonyms service
 *
 * Receives term to search as parameter.
 * Returns JSON string containing the result:
 *   {
 *     terms: [ <term>, <term>, ... ],            // list of terms returned, should be only one?
 *     origins: [ <origin>, <origin>, ...]          // list of origins of term, should be only one?
 *     definitions: [ <definition>, <definition>, ... ],  // list of definitions of term
 *     expressions: [                   // list of term associated expressions
 *       {
 *         expression: <expression>,            // expression
 *         definitions: [ <definition>, <definition>, ... ] // list of definitions of expression
 *       }, ...
 *     ]
 *   }
 *
 * Result code:
 *   0 - Term found and processed correctly
 *   1 - Term parameter not found
 *   2 - Timeout (5 seconds) found when accessing page.
 *   3 - Ambiguous term found.
 *   4 - Unknown term found.
 *   5 - Unknown response from web site.
 *
 */
var system = require('system');
var page = require('webpage').create();

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(2);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

var generateMDColor = function() {
  var colorPaletteDiv = document.querySelector('.color-palette');
  var colorGroups = colorPaletteDiv.querySelectorAll('.color-group');
  var mdObject = { type: "tag", name: "md-color", values: [] };
  var mdBlackColor = { name: "black", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "background-color", value: "#000000" } ] } ] };
  var mdWhiteColor = { name: "white", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "background-color", value: "#ffffff" } ] } ] };
  var mdTransparentColor = { name: "transparent", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "background-color", value: "transparent" } ] } ] };

  [].forEach.call(colorGroups, function(colorGroup) {
    var ul=colorGroup.querySelector('ul');
    var colorGroupObject = { name: "", defaultVariant: "", variants: [] };

    [].forEach.call(ul.querySelectorAll('li'), function(li) {
      if(li.classList.contains('main-color')) {
        var name = li.querySelector('span.name').innerText;
        var defaultVariant = li.querySelector('span.shade').innerText;
        colorGroupObject.name = name.toLowerCase().replace(" ","-");
        defaultVariant = defaultVariant.indexOf("A")==0 ? defaultVariant : "c" + defaultVariant;
        colorGroupObject.defaultVariant = defaultVariant.toLowerCase();
      } else {
        var name = li.querySelector('span.shade').innerText;
        var color = li.querySelector('span.hex').innerText;

        name = name.indexOf("A")==0 ? name : "c" + name;

        var variantObject = { css: [], name: name.toLowerCase() };
        variantObject.css.push({ property: "background-color", value: color } );
        var style = window.getComputedStyle(li);
        variantObject.css.push({ property: "color", value: style.color } );

        if(name != 1000) {
          colorGroupObject.variants.push(variantObject);
        }
      }
    });

    mdObject.values.push(colorGroupObject);
  });

  mdObject.values.push(mdBlackColor);
  mdObject.values.push(mdWhiteColor);
  mdObject.values.push(mdTransparentColor);

  return mdObject;
}

var generateMDFontColor = function() {
  var colorPaletteDiv = document.querySelector('.color-palette');
  var colorGroups = colorPaletteDiv.querySelectorAll('.color-group');
  var mdObject = { type: "tag", name: "md-font-color", values: [] };
  var mdBlackColor = { name: "black", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "color", value: "#000000" } ] } ] };
  var mdWhiteColor = { name: "white", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "color", value: "#ffffff" } ] } ] };
  var mdTransparentColor = { name: "transparent", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "color", value: "transparent" } ] } ] };

  [].forEach.call(colorGroups, function(colorGroup) {
    var ul=colorGroup.querySelector('ul');
    var colorGroupObject = { name: "", defaultVariant: "", variants: [] };

    [].forEach.call(ul.querySelectorAll('li'), function(li) {
      if(li.classList.contains('main-color')) {
        var name = li.querySelector('span.name').innerText;
        var defaultVariant = li.querySelector('span.shade').innerText;
        colorGroupObject.name = name.toLowerCase().replace(" ","-");
        defaultVariant = defaultVariant.indexOf("A")==0 ? defaultVariant : "c" + defaultVariant;
        colorGroupObject.defaultVariant = defaultVariant.toLowerCase();
      } else {
        var name = li.querySelector('span.shade').innerText;
        var color = li.querySelector('span.hex').innerText;

        name = name.indexOf("A")==0 ? name : "c" + name;

        var variantObject = { css: [], name: name.toLowerCase() };
        variantObject.css.push({ property: "color", value: color } );

        if(name != 1000) {
          colorGroupObject.variants.push(variantObject);
        }
      }
    });

    mdObject.values.push(colorGroupObject);
  });

  mdObject.values.push(mdBlackColor);
  mdObject.values.push(mdWhiteColor);
  mdObject.values.push(mdTransparentColor);

  return mdObject;
}

var generateMDDividerColor = function() {
  var colorPaletteDiv = document.querySelector('.color-palette');
  var colorGroups = colorPaletteDiv.querySelectorAll('.color-group');
  var mdObject = { type: "attribute", name: "md-divider-color", values: [] };
  var mdBlackColor = { name: "black", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "border-color", value: "#000000" } ] } ] };
  var mdWhiteColor = { name: "white", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "border-color", value: "#ffffff" } ] } ] };
  var mdTransparentColor = { name: "transparent", defaultVariant: "c1", variants: [ { name: "c1", css: [ { property: "border-color", value: "transparent" } ] } ] };

  [].forEach.call(colorGroups, function(colorGroup) {
    var ul=colorGroup.querySelector('ul');
    var colorGroupObject = { name: "", defaultVariant: "", variants: [] };

    [].forEach.call(ul.querySelectorAll('li'), function(li) {
      if(li.classList.contains('main-color')) {
        var name = li.querySelector('span.name').innerText;
        var defaultVariant = li.querySelector('span.shade').innerText;
        colorGroupObject.name = name.toLowerCase().replace(" ","-");
        defaultVariant = defaultVariant.indexOf("A")==0 ? defaultVariant : "c" + defaultVariant;
        colorGroupObject.defaultVariant = defaultVariant.toLowerCase();
      } else {
        var name = li.querySelector('span.shade').innerText;
        var color = li.querySelector('span.hex').innerText;

        name = name.indexOf("A")==0 ? name : "c" + name;

        var variantObject = { css: [], name: name.toLowerCase() };
        variantObject.css.push({ property: "border-color", value: color } );

        if(name != 1000) {
          colorGroupObject.variants.push(variantObject);
        }
      }
    });

    mdObject.values.push(colorGroupObject);
  });

  mdObject.values.push(mdBlackColor);
  mdObject.values.push(mdWhiteColor);
  mdObject.values.push(mdTransparentColor);

  return mdObject;
}

var args = system.args;
var term = args[1] ? args[1] : 'color';

var url = "http://www.google.com/design/spec/style/color.html";
var child = "";

page.open(url, function (status) {
  if(status !== "success" ) {
    console.log("ERROR!");
  } else {
  var jsonData = page.evaluate(term=='color' ? generateMDColor : term=='fontcolor' ? generateMDFontColor : generateMDDividerColor);
  console.log(JSON.stringify(jsonData,null,2));
  phantom.exit(0);
  }
});
