/**
 *
 */
var initMDInputList = function(MDInputList) {
  MDInputList.clickListener = function(e) {
    var el = e.currentTarget;
    var parentList = el.parentNode;

    if (el.tagName === 'MD-TILE' && parentList === this) {
      this.setSelectedItem(el);
    }
  }

  MDInputList.unsetSelected = function(tile) {
    tile.removeAttribute("selected");
    var multiple = this.getAttribute("md-multiple");
    if (multiple === "checkbox") {
      var checkbox = tile.querySelector('md-input[type="checkbox"]');
      if (checkbox) {
        checkbox.removeAttribute("checked");
      }
    } else {
      tile.removeAttribute("md-color");
    }
  }

  MDInputList.setSelected = function(tile) {
    tile.setAttribute("selected", "");
    var checkbox = tile.querySelector('md-input[type="checkbox"]');
    var multiple = this.getAttribute("md-multiple");
    if (multiple === "checkbox") {
      if (checkbox) {
        checkbox.setAttribute("checked", "");
      }
    } else {
      var backgroundColorClass = this.getAttribute("md-selected-color");
      if (backgroundColorClass) {
        tile.setAttribute("md-color", backgroundColorClass);
      }
    }
  }

  MDInputList.getSelectedValues = function() {
    var values = [];
    var options = MDInputList.querySelectorAll("md-tile");
    for (var i = 0; i < options.length; i++) {
      if (options[i].hasAttribute("selected")) {
        values.push(options[i].value);
      }
    }
    return values;
  }

  MDInputList.getSelectedItem = function() {
    var tile = this.querySelector("md-tile[selected]");
    return tile;
  }

  MDInputList.setSelectedItem = function(tile) {
    if (this.getAttribute("md-multiple")) {
      if (tile.hasAttribute("selected")) {
        this.unsetSelected(tile);
      } else {
        this.setSelected(tile);
      }
    } else {
      var oldTile = getSelectedItem();
      if (oldTile) {
        this.unsetSelected(oldTile);
      }

      if (oldTile !== tile) {
        this.setSelected(tile);
      }
    }
  }

  MDInputList.addItem = function(value, label, selected) {
    var tile = document.createElement("md-tile");
    tile.value = value;

    if (this.getAttribute("md-multiple") === 'checkbox') {
      var checkbox = document.createElement("md-input");
      checkbox.setAttribute("type", "checkbox");
      paperkit.initElement(checkbox);
      tile.appendChild(checkbox);
    }

    var text = document.createElement("md-text");
    text.textContent = label;
    paperkit.initElement(text);
    tile.appendChild(text);

    paperkit.initElement(tile);
    tile.addEventListener('click', this.clickListener.bind(this));
    this.appendChild(tile);

    if (selected) {
      this.setSelectedItem(tile);
    }
  }

  var options = MDInputList.querySelectorAll("option");
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    MDInputList.removeChild(option);
    MDInputList.addItem(option.value, option.textContent, option.hasAttribute("selected") ? true : false);
  }

  return MDInputList;
}
