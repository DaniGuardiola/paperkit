var initMDIcon = function(MDIcon, paperkit) {
  var avatarSVG = "<svg width=\"40\" height=\"40\">" +
    "<defs>" +
    "<pattern id=\"$$IMAGENAME$$\" x=\"0\" y=\"0\" patternUnits=\"userSpaceOnUse\" height=\"40\" width=\"40\">" +
    "<image x=\"0\" y=\"0\" height=\"40\" width=\"40\" xlink:href=\"$$IMAGE$$\"></image>" +
    "</pattern>" +
    "</defs>" +
    "<circle id=\"top\" cx=\"20\" cy=\"20\" r=\"20\" fill=\"url(#$$IMAGENAME$$)\"/>" +
    "</svg>";

  /**
   *
   */
  MDIcon.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE IN MD-ICON " + attrname + " VALUE " + newvalue);
    if (attrname === "md-image") {
      var svgFileURI = this.getImageURI(newvalue);
      if (svgFileURI) {
        this.loadSVG(svgFileURI);
      }
    }
  }

  /**
   * Returns an image URI for the given md-image attribute value.
   * @param {string} value The md-image attribute value.
   * @returns {string} The image URI.
   */
  MDIcon.getImageURI = function(value) {
    if (value.indexOf("icon:") != -1) {
      var iconName = paperkit.path + "resources/icon/" + value.substring(5).trim() + ".svg";
    } else {
      var iconName = value;
    }
    return iconName;
  }

  /**
   * Generates a new SVG and then replaces de OLD one.
   * @param {string} svgData Data of the new SVG to generate.
   */
  MDIcon.generateSVG = function(svgData) {
    var tmpDiv = document.createElement("div");
    tmpDiv.innerHTML = svgData;
    var svgElement = tmpDiv.children[0];
    tmpDiv.removeChild(svgElement);

    // Animated SVG Replacement
    this.replaceSVG(svgElement);
  }

  /**
   * Replaces the old svg with the given one,
   * and does a simple fade-in-out animation.
   * @param {Element} newSVGElement The element with the loaded svg.
   */
  MDIcon.replaceSVG = function(newSVGElement) {
    var _this = this;
    var oldSVGElement = _this.children.length > 0 ? _this.querySelector('svg:not(.transition)') : null;

    var oldSVGElementParent = oldSVGElement != null ? oldSVGElement.parentElement : null;
    if (oldSVGElementParent != null) {
      var transition = _this.getAttribute('md-transition');
      console.log(_this);
      if (transition == "fade-in-out") {
        _this.fadeInOutTransition(newSVGElement, oldSVGElement);
      } else if (transition == "up") {
        _this.upTransition(newSVGElement, oldSVGElement);
      } else if (transition == "down") {

      } else {
        _this.fadeInOutTransition(newSVGElement, oldSVGElement);
      }
    } else {
      _this.fadeInOutTransition(newSVGElement, oldSVGElement);
    }
  }

  /**
   * The newSVGElement makes a fade in transition and the oldSVGElement
   * makes afade out transition
   * @param {Element} newSVGElement The element with the new svg.
   * @param {Element} oldSVGElement The element with the old svg.
   */
  MDIcon.fadeInOutTransition = function(newSVGElement, oldSVGElement) {
    var _this = this;
    newSVGElement.style.opacity = "0";
    this.appendChild(newSVGElement);

    if (oldSVGElement) {
      oldSVGElement.addEventListener(transitionend, function(e) {
        _this.removeChild(oldSVGElement);
      });

      oldSVGElement.style.opacity = "0";
      oldSVGElement.classList.add("transition");
    }
    newSVGElement.style.opacity = "";
  }

  MDIcon.upTransition = function(newSVGElement, oldSVGElement) {
    var _this = this;

    if (oldSVGElement) {
      oldSVGElement.addEventListener(transitionend, function(e) {
        _this.removeChild(oldSVGElement);
        oldSVGElement.style.opacity = "0";
        this.appendChild(newSVGElement);
        newSVGElement.style.top = "";
        newSVGElement.style.opacity = "0";
      });
      oldSVGElement.style.top = "5";
      oldSVGElement.classList.add("transition");
    }
  }

  /**
   * Loads a SVG File from the server and uses it in this md-button.
   * It generates an avatar image or a icon image depending on the type of md-icon this is.
   * @param {string} svgFileURI The file URI to load.
   */
  MDIcon.loadSVG = function(fileURI) {
    if (this.getAttribute('md-type') === 'icon' || !this.getAttribute('md-type')) {
      var xhr = new XMLHttpRequest;
      var _this = this;
      xhr.open("GET", fileURI, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.addEventListener("load", function(e) {
        _this.generateSVG(xhr.responseText);
      });
      xhr.send();
    } else {
      var imgName = this.makeId();
      var svgData = avatarSVG.replace('$$IMAGE$$', fileURI).replace(/\$\$IMAGENAME\$\$/g, imgName);
      this.generateSVG(svgData);
    }
  }

  // Init image
  MDIcon.attributeChangedCallback('md-image', '', MDIcon.getAttribute('md-image') ? MDIcon.getAttribute('md-image') : '');

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var element = mutation.target;
      element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
    });
  });

  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  observer.observe(MDIcon, config);
}
