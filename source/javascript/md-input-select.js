/**
 * Select input element initializer
 * 
 * @param {element} el Element being initialized
 */
var initMDInputSelect = function(MDInputSelect, materializer) {
  var spanText;
  var value;
  var menu;

  /**
   * Click listener
   * 
   * @param {Event} e Listener for click events in this element
   */
  MDInputSelect.clickListener = function(e) {
    var el = e.currentTarget;
    console.log("CLICK EN INPUT SELECT");
    if (el.tagName === "MD-INPUT" && el === this) {
      if(!this.menu) {
        this.menu = document.createElement('md-menu');
        this.menu.id = this.getMenuId();
        materializer.initElement(this.menu);        
        document.body.appendChild(this.menu);
      }

      this.menu.setAttribute("md-position", "parentInputSelect");
      this.menu.clearOptions();
      
      // TODO: Should this be done allways???? 
      // It's slow as hell if there are lots of options...
      // Add options as md-tiles
      [].forEach.call(this.querySelectorAll('option'), function(option) {
        this.menu.addOption(option.getAttribute('value'), option.innerText);
      }, this);      
      
      this.value = this.getAttribute('value');
      this.menu.setSelectedValue(this.getAttribute('value'));
      this.menu.setCallback(this.menuListener.bind(this));
      this.menu.open(this);
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
      var value = this.value = tile.getAttribute('value');
      

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