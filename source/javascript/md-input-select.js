/**
 * Select input element initializer
 * @param  {element} el Element being initialized
 */
var initMDInputSelect = function(el, materializer) {
	var spanText;

	el.initElements = function() {
		var value = this.getAttribute('value');
		if (this.querySelector('option[value="' + value + '"')) {
			var valueText = this.querySelector('option[value="' + value + '"').innerText;
		}

		this.spanText = document.createElement("span");
		this.spanText.classList.add('text');
		this.spanText.innerText = valueText;
		this.appendChild(this.spanText);

		var icon = document.createElement('md-icon');
		icon.setAttribute('md-image','arrow_drop_down');
		icon.setAttribute('md-fill','grey');
		initMDIcon(icon, materializer);
		this.appendChild(icon);

		var divLine = document.createElement("div");
		divLine.classList.add("line");
		this.appendChild(divLine);

		this.addEventListener('click',function(){
			if (document.getElementById(this.id + '-menu')) {
				var menu = document.getElementById(this.id + '-menu');
			} else {
				var menu = document.createElement('md-menu');
				menu.id = this.id + '-menu';
				var list = document.createElement('md-list');
				list.setAttribute('md-action','');
				[].forEach.call(el.querySelectorAll('option'), function(option){
					console.log(option);
					var tile = document.createElement('md-tile');
					tile.innerHTML = '<md-text>' + option.innerText + '</md-text>';
					tile.setAttribute('value',option.getAttribute('value'));
					if (el.getAttribute('value')==option.getAttribute('value') || option.getAttribute('selected')) {
						tile.classList.add('selected');
					}
					list.appendChild(tile);
				});
				console.log(list);
				menu.appendChild(list);
				document.body.appendChild(menu);
				initMDMenu(menu);
			}
		    if(menu) {
		      if(menu.status!="open") {
		        menu.open(el,{"select": true, "selectEl": el});
		        document.addEventListener('click', menu.close);
		        if (event.stopPropagation) {
		          event.stopPropagation();
		        } else {
		          event.cancelBubble = true;
		        }
		      } else {
		        menu.close(true);
		        document.removeEventListener('click', menu.close);
		      }
		    }
		});
	}
	el.initElements();
}