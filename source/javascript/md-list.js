// TODO: Review callFunction and execuieFunctionByName calls

var initMDList = function(MDList, paperkit) {
  /**
   * Callback for attribute change
   * @param {string} attrname Attribute name
   *
   */
  MDList.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  MDList.clickListener = function(e) {
    var el = e.currentTarget;
    var parentList = el.parentNode;

    if (el.tagName === 'MD-TILE' && parentList === this) {
      console.log("Fired click on " + el.tagName);
      if (el.getAttribute('md-action')) {
        var action = el.getAttribute('md-action');
      } else {
        var action = el.parentElement && el.parentElement.getAttribute("md-action") ? el.parentElement.getAttribute('md-action') : 'none';
      }

      switch (action) {
        case 'none':
          break;
        default:
          if (action.indexOf('custom:') != -1) {
            var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
            callFunction(f, el);
          } else if (action.indexOf('ajax:') != -1) {
            var f = action.substring(action.indexOf('ajax:') + 'ajax:'.length).trim();
            paperkit.ajaxInsert(el.getAttribute('md-ajax'), getEl(f), function(resp, container) {
              paperkit.initElement(container);
              if (el.getAttribute('md-ajax-callback')) {
                callFunction(el.getAttribute('md-ajax-callback'), el);
              };
            });
          } else if (action.indexOf('link:') != -1) {
            var f = action.substring(action.indexOf('link:') + 'link:'.length).trim();
            linkRedirect(f, el);
          } else if (action.indexOf('link-out:') != -1) {
            var f = action.substring(action.indexOf('link-out:') + 'link-out:'.length).trim();
            window.open(f);
          }
          break;
      }
    }
  };

  var linkRedirect = function(linkattr, target) {
    var link = target.getAttribute(linkattr);
    document.location.href = link;
  }

  var callFunction = function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, false, [target]);
  };

  MDList.initList = function() {
    var children = MDList.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName === 'MD-TILE') {
        var tile = children[i];
        tile.addEventListener('click', MDList.clickListener.bind(this));
      }
    }
  }

  /**
   * Clears the options list
   */
  MDList.clearItems = function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /**
   * Adds an option to the list.
   * @param {string} id The id for the option
   * @param {string} label The label for the option
   * @returns {Element} The created tile
   */
  MDList.addItem = function(id, label) {
    var tile = document.createElement('md-tile');
    tile.id = id;
    tile.innerHTML = '<md-text>' + label + '</md-text>';
    tile.addEventListener('click', MDList.clickListener.bind(this));
    this.appendChild(tile);
    return tile;
  }

  // Initialize listerner
  MDList.initList();

  // SET INITIAL PROPERTIES  
  if (MDList.getAttribute('md-action')) {
    MDList.attributeChangedCallback('md-action', '', MDList.getAttribute('md-action'));
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
  observer.observe(MDList, config);
}
