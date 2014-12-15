/**
 * Select input element initializer
 * 
 * @param {element} el Element being initialized
 */
var initMDInputSelect = function(MDInputSelect, materializer) {
  var spanText;

  /**
   * Click listener
   * 
   * @param {Event} e Listener for click events in this element
   */
  MDInputSelect.clickListener = function(e) {
    var el = e.currentTarget;
    console.log("CLICK EN INPUT SELECT");
    if (el.tagName === "MD-INPUT" && el === this) {
      if (document.getElementById(this.id + '-menu')) {
        var menu = document.getElementById(this.id + '-menu');
      } else {
        // Create md-menu element
        // Should it be done this way? Does an md-input-select have to know how
        // an md-menu is internally built?
        var menu = document.createElement('md-menu');
        menu.id = this.getMenuId();
        menu.setAttribute("md-position", "parentInputSelect");
        
        // Create md-list element inside menu element
        var list = document.createElement('md-list');
        list.setAttribute('md-action', '');

        // Add options as md-tiles
        [].forEach.call(this.querySelectorAll('option'), function(option) {
          var tile = document.createElement('md-tile');
          tile.innerHTML = '<md-text>' + option.innerText + '</md-text>';
          tile.setAttribute('value', option.getAttribute('value'));
          list.appendChild(tile);
        }, this);

        menu.appendChild(list);
        document.body.appendChild(menu);
      }

      // TODO: See if this is needed, because of mutation observer.
      materializer.initElement(menu);
      menu.setSelectedValue(this.getAttribute('value'));
      menu.setCallback(this.menuListener.bind(this));
      menu.open(this);
    }

    if (event.stopPropagation) {
      event.stopPropagation(this.menuListener)
    } else {
      event.cancelBubble = true
    }
  }

  /**
   * Listener for menu selection. Callback for the menu object.
   * 
   * @param {element} tile The selected tile element.
   */
  MDInputSelect.menuListener = function(tile, menu) {
    if (tile) {
      var text = tile.querySelector('md-text').innerText;
      var value = tile.getAttribute('value');

      // Change selected option, text and value.
      this.spanText.innerText = text;
      this.setAttribute('value', value);

      // Change list selected option
      // TODO: Is this this element responsability? Does this element have to know list internal structure?
      menu.setSelectedValue(value);
    }

    // Close the menu.
    menu.close(true);
  }

  /**
   * Generates child menu ID
   * 
   * @return {string} the child menu ID.
   */
  MDInputSelect.getMenuId = function() {
    return this.id + "-menu";
  }

  /**
   * Initializes md-input elements
   */
  MDInputSelect.initElements = function() {
    var value = this.getAttribute('value');

    if (this.querySelector('option[value="' + value + '"')) {
      var valueText = this.querySelector('option[value="' + value + '"').innerText;
    }

    this.spanText = document.createElement("span");
    this.spanText.classList.add('text');
    this.spanText.innerText = valueText;
    this.appendChild(this.spanText);

    var icon = document.createElement('md-icon');
    icon.setAttribute('md-image', 'arrow_drop_down');
    icon.setAttribute('md-fill', 'grey');
    initMDIcon(icon, materializer);
    this.appendChild(icon);

    var divLine = document.createElement("div");
    divLine.classList.add("line");
    this.appendChild(divLine);
    
    this.calcWidth();

    this.addEventListener('click', this.clickListener.bind(this));
  }

  /**
   * Calculates width of element based on font size.
   * @param {
   */
  MDInputSelect.calcWidth = function() {
    var longestString = "";
    var elementStyle = window.getComputedStyle(this.querySelector('span.text'));
    [].forEach.call(this.querySelectorAll("option"), function(option) {
      longestString = option.innerText.length > longestString.length
              ? option.innerText : longestString;
    });
    this.style.width = (materializer.calcTextMetrics(longestString,
            elementStyle).width + 36)
            + "px";
  }

  MDInputSelect.initElements();
}