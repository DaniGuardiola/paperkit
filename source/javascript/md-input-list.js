/**
 * 
 */
var initMDInputList = function(MDInputList) {  
  MDInputList.clickListener = function(e) {
    var el = e.currentTarget;
    var parentList = el.parentNode;
    
    if(el.tagName==='MD-TILE' && parentList===this) {
      this.setSelectedItem(el);
    }
  }
    
  MDInputList.unsetSelected= function(tile) {
    tile.removeAttribute("selected");
    var checkbox = tile.querySelector('md-input[type="checkbox"]');
    if(checkbox) {
      checkbox.removeAttribute("checked");
    }
  }
  
  MDInputList.setSelected= function(tile) {
    tile.setAttribute("selected","");
    var checkbox = tile.querySelector('md-input[type="checkbox"]');
    if(checkbox) {
      checkbox.setAttribute("checked", "");
    }
  }
  
  MDInputList.getSelectedItem= function() {
    var tile = this.querySelector("md-tile[selected]");
    return tile;
  }
  
  MDInputList.setSelectedItem= function(tile) {
    if(this.getAttribute("md-multiple")) {
      if(tile.hasAttribute("selected")) {
        this.unsetSelected(tile);
      } else {
        this.setSelected(tile);
      }      
    } else {
      var oldTile = getSelectedItem();
      if(oldTile) {
        this.unsetSelected(oldTile);
      }
      
      if(oldTile !== tile) {
        this.setSelected(tile);
      }      
    }
  }
  
  MDInputList.addItem=function(value, label) {
    var tile = document.createElement("md-tile");
    tile.value = value;
        
    if(this.getAttribute("md-multiple")==='checkbox') {
      var checkbox = document.createElement("md-input");
      checkbox.setAttribute("type","checkbox");
      materializer.initElement(checkbox);
      tile.appendChild(checkbox);
    }
    
    var text = document.createElement("md-text");
    text.textContent=label;
    materializer.initElement(text);
    tile.appendChild(text);
    
    materializer.initElement(tile);
    tile.addEventListener('click', this.clickListener.bind(this));
    this.appendChild(tile);
  }
  
  var options = MDInputList.querySelectorAll("option"); 
  for(var i=0; i<options.length; i++) {
    var option = options[i];
    MDInputList.removeChild(option);
    MDInputList.addItem(option.value, option.textContent);
    
  }
  
  return MDInputList;
}