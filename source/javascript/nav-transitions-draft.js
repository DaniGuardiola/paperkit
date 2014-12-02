var transition = {
	status: {
		lastMorphFrom: false
	},
	copyRect: function(what,where,notrans,nobg) {
		what = getEl(what);
		if (!where) {
			return false;
		}
		if (notrans) {
			what.style.transition = "none";
		} else if (!notrans) {
			what.style.transition = "all 0.5s";
		}
		if (where === "full") {
			what.style.borderRadius = "0";
			what.style.position = "fixed";
			what.style.top = "0";
			what.style.left = "0";
			what.style.width = "100%";
			what.style.height = "100%";
		} else {
			whereStyle = window.getComputedStyle(getEl(where));
			where = getEl(where).getBoundingClientRect();
			what.style.borderRadius = whereStyle.borderRadius;
			if (whereStyle.backgroundColor != 'rgba(0, 0, 0, 0)' && !nobg) {
				what.style.backgroundColor = whereStyle.backgroundColor;
			} else if (!nobg) {
				what.style.backgroundColor = "#fff";
			}			
			console.log("HEYHEYHEY: " + whereStyle.backgroundColor);
			what.style.position = "fixed";
			what.style.top = where.top + "px";
			what.style.left = where.left + "px";
			what.style.width = where.width + "px";
			what.style.height = where.height + "px";
		}
	},
	morph: function(what,where,callback){
		if (what) {
			transition.status.lastMorphFrom = getEl(what);
		} else {
			return false;
		}
		var whatStyle = window.getComputedStyle(getEl(what));
		if (!where) {
			var where = "full";
		}
		var whatClon = document.createElement('div');
		whatClon.id = "md-morph";
		whatClon.setAttribute("md-shadow","shadow-0");
		whatStyle = window.getComputedStyle(getEl(what));
		if (whatStyle.zIndex >= 400) {
			whatClon.style.zIndex = whatStyle.zIndex + 1;
		} else {
			whatClon.style.zIndex = "400";
		}
		whatClon.style.backgroundColor = "transparent";
		transition.copyRect(whatClon,what,false,true);
		document.body.appendChild(whatClon);
		setTimeout(function(){
			whatClon.setAttribute("md-shadow","shadow-3");
			if (whatStyle.backgroundColor != 'rgba(0, 0, 0, 0)') {
				whatClon.style.backgroundColor = whatStyle.backgroundColor;
			} else {
				whatClon.style.backgroundColor = "#fff";
			}
		},10);
		setTimeout(function(){
			transition.copyRect(whatClon,where);
			setTimeout(function(){
				if (callback) {
					callback(whatClon);
				}				
			},500);
			getEl(what).style.opacity = 0;
		},510);
		return whatClon;
	},
	morphBack: function(target,callback){
		var morphEl = document.getElementById('md-morph');
		if (!morphEl) {
			return false;
		}
		if (transition.status.lastMorphFrom) {
			transition.copyRect(morphEl,transition.status.lastMorphFrom);
			morphEl.classList.add('op-0-child');
			console.log('I DID IT');
		}
		setTimeout(function(){
			morphEl.setAttribute('md-shadow','shadow-0');
			morphEl.style.backgroundColor = 'transparent';
			setTimeout(function(){
				document.body.removeChild(morphEl);
				if(callback) {
					callback(morphEl);
				}
			},500);
			getEl(transition.status.lastMorphFrom).style.opacity = '';
		},510);
	}
};

function getEl(el){
	if (el) {
		if (el.nodeType) {
			return el;
		} else if (document.querySelector(el)) {
			return document.querySelector(el);
		}
	} else {
		return false;
	}
	
}