/**
 * Select input element initializer
 * @param  {element} el Element being initialized
 */
var initMDInputSelect = function(MDInputSelect, materializer) {
	var spanText;

	MDInputSelect.clickListener= function(e) {
		var el = e.currentTarget;

		if(el.tagName==="MD-INPUT" && el===this) {
			if (document.getElementById(this.id + '-menu')) {
				var menu = document.getElementById(this.id + '-menu');
			} else {
				// Create md-menu element
				var menu = document.createElement('md-menu');
				menu.id = this.getMenuId();
				menu.setAttribute("md-position", "parentInputSelect");

				// Create md-list element inside menu element
				var list = document.createElement('md-list');
				list.setAttribute('md-action','');

				// Add options as md-tiles
				[].forEach.call(this.querySelectorAll('option'), function(option) {
					var tile = document.createElement('md-tile');
					tile.innerHTML = '<md-text>' + option.innerText + '</md-text>';
					tile.setAttribute('value',option.getAttribute('value'));

					// TODO: Review this condition, why check both options?
					if (this.getAttribute('value')==option.getAttribute('value') || option.getAttribute('selected')) {
						tile.classList.add('selected');
					}

					list.appendChild(tile);
				}, this);

				menu.appendChild(list);
				document.body.appendChild(menu);
				// TODO: See if this is needed, because of mutation observer.
				initMDMenu(menu);
				menu.open(this);
			}
		    
		  // TODO: Is this check needed?
		  /*
	    if(menu) {
	      if(menu.status != "open") {
	      	// TODO: Check why passing same thing in TWO ARGUMENTS
	        menu.open(this);
	        document.addEventListener('click', this.closeListener.bind(this));

	        if (event.stopPropagation) {
	          event.stopPropagation();
	        } else {
	          event.cancelBubble = true;
	        }
	      } else {
	        menu.close(true);
	        document.removeEventListener('click', this.closeListener);
	      }
	    }
	    */
	  }
	}

	MDInputSelect.closeListener= function(e) {
		var el = e.currentTarget;
		var menu = document.getElementById(MDInputSelect.getMenuId());

		// TODO: See if this method is the best, or maybe we should cancel bubbling...
		if(menu) {
			// var selectedOption = menu.getSelectedOption();
			menu.close(true);			
		}
	}

	/**
	 * Generates child menu ID
	 * @return {string} the child menu ID.
	 */
	MDInputSelect.getMenuId= function() {
		return this.id + "-menu";
	}

	MDInputSelect.initElements = function() {
		var value = this.getAttribute('value');

		if (this.querySelector('option[value="' + value + '"')) {
			var valueText = this.querySelector('option[value="' + value + '"').innerText;
		}

		this.spanText= document.createElement("span");
		this.spanText.classList.add('text');
		this.spanText.innerText = valueText;
		this.appendChild(this.spanText);

		var icon= document.createElement('md-icon');
		icon.setAttribute('md-image','arrow_drop_down');
		icon.setAttribute('md-fill','grey');
		initMDIcon(icon, materializer);
		this.appendChild(icon);

		var divLine = document.createElement("div");
		divLine.classList.add("line");
		this.appendChild(divLine);

		this.addEventListener('click',this.clickListener.bind(this));
	}

	MDInputSelect.calcWidth = function(fontSize) {
		var longestString = "";
		var elementStyle = window.getComputedStyle(this.querySelector('span.text'));
		[].forEach.call(this.querySelectorAll("option"), function(option) {
			longestString = option.innerText.length > longestString.length ? option.innerText : longestString;
		});
		this.style.width = (materializer.calcTextMetrics(longestString, elementStyle).width + 36) + "px";
	}

	MDInputSelect.initElements();
}