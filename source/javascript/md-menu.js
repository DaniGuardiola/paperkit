/**
 * @class MDMenu
 */
var initMDMenu = function(MDMenu) {
  // Status of menu (opened | closed).
  MDMenu.status = "closed";

  // Parent element of menu.
  MDMenu.callbackFunction = null;
  MDMenu.bindedListener = null;

  // Calculated height
  MDMenu.calulatedHeight = null;

  /**
   * Inits the menu.
   * Sets width according to options and multiple widths.
   */
  MDMenu.init = function() {
    console.log("INITIALIZING MD-MENU");
    this.status = "closed";
  }

  /**
   * Opens the menu.
   * @param {Element} parent Parent element this menu depends on.
   */
  MDMenu.open = function(parent) {
    var openMode = this.getAttribute("md-position");

    // Recalculates width
    this.generateWidth();

    if (openMode === "parentInputSelect") {
      this.parentInputSelectOpen(parent);
    } else if (openMode === "parentIcon") {
      this.parentIconOpen(parent);
    } else {
      // TODO: SIMPLY SHOW UP
    }

    // TODO: Review transition, not working well.
    // Show and animate
    var endHeight = this.style.maxHeight;
    this.style.maxHeight = "0px";
    this.style.transition = "max-height 0.25s ease-in-out";
    this.style.visibility = "visible";
    this.style.maxHeight = endHeight;

    // TODO: Review, should this be done on animation end?
    // Add listener and set status
    this.bindedListener = this.clickListener.bind(this); // Trick to be able to remove binded listener
    document.addEventListener('click', this.bindedListener);
    this.status = "opened";
  }

  /**
   * Closes the menu.
   * @param {boolean} Optionally destroy menu element...
   */
  MDMenu.close = function(destroy) {
    // Transition
    this.style.overflow = 'hidden';
    this.calculatedHeight = this.style.maxHeight;
    this.style.maxHeight = "0px";
    this.addEventListener(transitionend, this.endOfCloseTransition);

    // TODO: Review, should this be done on animation end?
    // Remove listener and set status
    document.removeEventListener('click', this.bindedListener);
    this.status = "closed";
  }

  /**
   * Listener for end of transition.
   * @param {Event} e Event object @see {url https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDMenu.endOfCloseTransition = function(e) {
    this.style.overflow = '';
    this.style.visibility = "hidden";
    this.style.maxHeight = this.calculatedHeight;
    this.removeEventListener(transitionend, this.endOfCloseTransition);
  }

  /**
   * Generates and sets the menu width.
   */
  MDMenu.generateWidth = function() {
    var stepWidth = isMobile() ? 56 : 64;
    var originalWidth = this.getBoundingClientRect().width;
    var steps = Math.ceil(originalWidth / stepWidth);
    this.style.width = ((steps * stepWidth) < 2 ? 1.5 : (steps * stepWidth)) + "px";
  }

  /**
   * Open this menu related to a parent icon
   * @param {Element} parent Parent icon.
   * TODO: review
   */
  MDMenu.parentIconOpen = function(parent) {
    var parentRect = parent.getBoundingClientRect();
    var viewPort = getViewport();

    this.style.right = (viewPort.width - parentRect.right) + "px";
    this.style.top = parentRect.top + "px";
  }

  /**
   * Open related to a parent input select
   * TODO: REVIEW TOO MANY HARDCODED VALUES!!!?!??!?!?!
   * @param {Element} parent Parent input select
   */
  MDMenu.parentInputSelectOpen = function(parent) {
    var parentRect = parent.getBoundingClientRect();
    var viewPort = getViewport();

    this.style.maxHeight = "200px";
    this.style.overflow = "auto";
    this.style.left = (parentRect.left - 16) + "px";
    this.style.top = (parentRect.top - 6) + "px";

    if (this.children.length < 5 || true) {
      if (this.querySelector('md-tile[selected]')) {
        var selected = this.querySelector('md-tile[selected]');
        this.scrollTop = selected.offsetTop - 8;

        if (this.scrollTop != selected.offsetTop) {
          this.style.top = (parseInt(this.style.top) - (selected.offsetTop - this.scrollTop - 8)) + 'px';
        }
      }
    }

    /**
     * TODO: Review
     * PARA QUE SIRVE ESTO????
     * EL POSICIONAMIENTO SIGUE FUNCIONANDO BIEN SIN ELLO
     *
    menuRect = this.getBoundingClientRect();
    if(menuRect.top < 32) {
      this.style.top = '32px';
    } else if (viewPort.height - menuRect.bottom < 32) {
      this.style.top = (viewPort.height - 32 - menuRect.height) + 'px';
    }
    */
  }

  /**
   * Listener for menu click events.
   * Calls custom functions and callbacks.
   * @param {Event} e Event object. @see {url https://developer.mozilla.org/en-US/docs/Web/API/Event}
   */
  MDMenu.clickListener = function(e) {
    var el = e.currentTarget;
    var target = e.target;
    console.log("CLICK EN MENU");

    if (this.status === "opened") {
      var tile = this.contains(target) ? this.findTile(target) : null;

      var action = this.getAttribute("md-action") ? this.getAttribute('md-action') : 'none';

      switch (action) {
        default: if (action.indexOf('custom:') != -1) {
            var functionName = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
            el.callFunction(functionName, tile);
          }
        break;
      }

      if (this.callbackFunction) {
        this.callbackFunction(tile, this);
      }
    }
  }

  /**
   * Callback for menu selection
   * This function gets called when click is done in menu.
   * It receives an argument with the selected tile or null if no tile selected.
   *
   * @param {function} func Callback function.
   */
  MDMenu.setCallback = function(func) {
    this.callbackFunction = func;
  }

  /**
   *
   */
  MDMenu.findTile = function(el) {
    while ((el = el.parentElement) && el.tagName !== "MD-TILE") {
      if (el.tagName === "MD-MENU") {
        return null;
      }
    }
    return el;
  }

  /**
   * Switches menu state from open to closed and viceversa.
   */
  MDMenu.switchState = function() {
    if (this.getAttribute('md-state') !== "open") {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Gets the currently selected element
   * @return {Element} md-tile currently selected
   */
  MDMenu.getSelectedElement = function() {
    var selectedElement = this.querySelector("md-tile[selected]");
    return selectedElement;
  }

  /**
   * Gets the current selected value
   * @return {string} The selected element value.
   */
  MDMenu.getSelectedValue = function() {
    var selectedElement = this.getSelectedElement();
    if (selectedElement) {
      return selectedElement.getAttribute("value");
    }
    return null;
  }

  /**
   * Sets selected value
   * @param {string} value - The value to set.
   */
  MDMenu.setSelectedValue = function(value) {
    if (!value) {
      return;
    }

    var selectedElement = this.getSelectedElement();
    if (selectedElement) {
      selectedElement.removeAttribute('selected');
    }

    var queryByValue = 'md-tile[value="' + value + '"]';
    var element = this.querySelector(queryByValue);
    if (element) {
      element.setAttribute('selected', '');
    }
  }

  /**
   * Clears the options list
   */
  MDMenu.clearOptions = function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /**
   * Adds an option to the menu.
   * @param {string} value The value for the option
   * @param {string} label The label for the option
   */
  MDMenu.addOption = function(value, label) {
    var tile = document.createElement('md-tile');
    tile.innerHTML = '<md-text>' + label + '</md-text>';
    tile.setAttribute('value', value);
    this.appendChild(tile);
  }

  MDMenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  }

  /**
   * Calls an external function
   * TODO: Generalize
   * @param {string} functionName The function name
   * @param {array}  params       Array of parameters
   */
  var callFunction = function(functionName, params) {
    console.log("calling function " + functionName);
    executeFunctionByName(f, window, params);
  }

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
  observer.observe(MDMenu, config);

  // Init Menu
  MDMenu.init();
}
