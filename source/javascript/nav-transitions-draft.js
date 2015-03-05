/* global whereStyle, destinationRect, parentElement, tmpDiv */
/* exported Transition */

function getEl(el) {
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

var transition = {
  status: {
    lastMorphFrom: false
  },
  copyRect: function(what, where, notrans, nobg) {
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
      if (whereStyle.backgroundColor !== "rgba(0, 0, 0, 0)" && !nobg) {
        what.style.backgroundColor = whereStyle.backgroundColor;
      } else if (!nobg) {
        what.style.backgroundColor = "#fff";
      }
      what.style.position = "fixed";
      what.style.top = where.top + "px";
      what.style.left = where.left + "px";
      what.style.width = where.width + "px";
      what.style.height = where.height + "px";
    }
  },
  morph: function(what, where, callback, id) {
    if (what) {
      transition.status.lastMorphFrom = getEl(what);
    } else {
      return false;
    }
    var whatStyle = window.getComputedStyle(getEl(what));
    if (!where) {
      where = "full";
    }
    var whatClon = document.createElement("div");
    if (id) {
      whatClon.id = id;
    } else {
      whatClon.id = "md-morph";
    }
    whatClon.setAttribute("md-shadow", "shadow-0");
    whatStyle = window.getComputedStyle(getEl(what));
    if (whatStyle.zIndex >= 400) {
      whatClon.style.zIndex = whatStyle.zIndex + 1;
    } else {
      whatClon.style.zIndex = "400";
    }
    whatClon.style.backgroundColor = "transparent";
    transition.copyRect(whatClon, what, false, true);
    document.body.appendChild(whatClon);
    setTimeout(function() {
      whatClon.setAttribute("md-shadow", "shadow-3");
      if (whatStyle.backgroundColor !== "rgba(0, 0, 0, 0)") {
        whatClon.style.backgroundColor = whatStyle.backgroundColor;
      } else {
        whatClon.style.backgroundColor = "#fff";
      }
    }, 10);
    setTimeout(function() {
      whatClon.style.transitionTimingFunction = "ease-in";
      transition.copyRect(whatClon, where);
      setTimeout(function() {
        if (callback) {
          callback(whatClon);
        }
      }, 500);
      getEl(what).style.opacity = 0;
    }, 210);
    return whatClon;
  },
  morphBack: function(target, callback) {
    var morphEl = document.getElementById("md-morph");
    if (!morphEl) {
      return false;
    }
    var to;
    if (target && target.nodeType && target.getAttribute("md-morph-back")) {
      to = getEl(target.getAttribute("md-morph-back"));
    } else if (getEl(target)) {
      to = getEl(target);
    } else if (transition.status.lastMorphFrom) {
      to = transition.status.lastMorphFrom;
    } else {
      return false;
    }
    transition.copyRect(morphEl, to);
    morphEl.classList.add("op-0-child");
    setTimeout(function() {
      morphEl.setAttribute("md-shadow", "shadow-0");
      morphEl.style.backgroundColor = "transparent";
      setTimeout(function() {
        document.body.removeChild(morphEl);
        if (callback) {
          callback(morphEl);
        }
      }, 500);
      to.style.opacity = "";
    }, 510);
  }
};


var Transition = function(ownerElement) {
  this.ownerElement = ownerElement;
  this.tmpDiv = document.createElement("div");
  this.tmpDiv.id = "tmpDiv";
  this.tmpDiv.style.position = "absolute";
  this.tmpDiv.style.visibility = "hidden";
  document.body.appendChild(tmpDiv);

  this.morph = function(originElement, destinationElement) {
    if (originElement) {
      this.originElement = originElement;
    }

    if (destinationElement) {
      this.destinationRect = destinationElement.getBoundingClientRect();
    }

    // Initial state...
    this.whatElement.style.borderRadius = "0";
    this.whatElement.style.zIndex = "400";
    this.parentElement.style.position = "absolute";
    this.parentElement.style.top = "0px";
    this.parentElement.style.left = "0px";
    this.parentElement.style.width = originElement.getBoundingClientRect().width;
    this.parentElement.style.height = originElement.getBoundingClientRect().height;

    this.whatElement.style.transition = "all 0.5s";

    this.whatElement.style.top = destinationRect.top + "px";
    this.whatElement.style.left = destinationRect.left + "px";
    this.whatElement.style.width = destinationRect.width + "px";
    this.whatElement.style.height = destinationRect.height + "px";
  };

  this.expand = function() {

    var initialHeight = parentElement ? parentElement.getBoundingClientRect().height : 0;
    var finalHeight = ownerElement.getBoundingClientRect().height;
    /*
    		collectorTile.style.transition = "max-height 0.5s";
    			collectorTile.style.marginTop="20px";
    			collectorTile.style.marginBottom="20px";
    			collectorTile.style.width="114%";
    			collectorTile.style.left="-7%";
    		collectorTile.style.maxHeight = height + "px";
    		collectorTile.parentNode.parentNode.style.overflow="visible";
    */
    ownerElement.style.height = initialHeight + "px";
    ownerElement.style.visibility = "visible";
    ownerElement.style.transition = "height 0.5s ease-in-out";
    ownerElement.style.height = finalHeight + "px";
  };
};
