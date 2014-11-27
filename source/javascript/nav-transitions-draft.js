var transition = {
	status: {
		lastMorphFrom: false
	},
	copyRect: function(what,where,notrans) {
		what = getEl(what);
		if (!where) {
			return false;
		}
		if (notrans) {
			what.style.transition = "none";
		} else if (!notrans) {
			what.style.transition = "all 0.25s";
		}
		if (where === "full") {
			what.style.position = "fixed";
			what.style.top = "0";
			what.style.left = "0";
			what.style.width = "100%";
			what.style.height = "100%";
		} else {
			where = getEl(where).getBoundingClientRect();
			what.style.position = "fixed";
			what.style.top = where.top + "px";
			what.style.left = where.left + "px";
			what.style.width = where.width + "px";
			what.style.height = where.height + "px";
		}
	},
	morph: function(what,where,callback){
		if (what) {
			transition.lastMorphFrom = getEl(what);
		} else {
			return false;
		}
		if (!where) {
			var where = "full";
		}
		var whatClon = document.createElement('div');
		whatClon.id = "md-morph";
		whatClon.setAttribute("md-shadow","shadow-0");
		whatClon.style.zIndex = "400";
		whatClon.style.backgroundColor = "transparent";
		transition.copyRect(whatClon,what);
		document.body.appendChild(whatClon);
		setTimeout(function(){
			whatClon.setAttribute("md-shadow","shadow-3");
			whatClon.style.backgroundColor = "#fff";
		},10);
		setTimeout(function(){
			transition.copyRect(whatClon,where);
			setTimeout(function(){
				callback(whatClon);
			},250);
		},260);
		return whatClon;
	},
	morphBack: function(target,callback){
		var morphEl = document.getElementById('md-morph');
		if (!morphEl) {
			return false;
		}
		if (transition.lastMorphFrom) {
			transition.copyRect(morphEl,transition.lastMorphFrom);
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
			},250);
		},260);
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