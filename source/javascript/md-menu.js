var initMDMenu = function(MDMenu) {
  MDMenu.setAttribute('md-status','closed');

  MDMenu.open = function(parent, opt) {
    MDMenu.style.display="";

    var parentRect= parent.getBoundingClientRect();
    var viewPort= getViewport();

    if (!opt) {
      // Positioning
      // Better support for Dani's ideas
      // it can be personalized with a md-menu attribute
      // or even with a parent attribute, have to see the best way
      MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
      MDMenu.style.top= parentRect.top + "px";

      // Animation
      MDMenu.style.height="";
      MDMenu.setAttribute('md-status','open');
    } else {
      if (opt.select) {
        MDMenu.style.maxHeight= "200px";
        MDMenu.style.overflow= "auto";
        MDMenu.style.left= (parentRect.left - 16) + "px";
        MDMenu.style.top= (parentRect.top - 6) + "px";
        var menuRect = MDMenu.getBoundingClientRect();
        if (isMobile()) {
          var x = 28;
        } else {
          var x = 32;
        }
        var nX = (menuRect.width + 16) / x;
        MDMenu.style.width = ((nX + 1) * x) + "px";
        if (MDMenu.children.length<5 || true) {
          if(MDMenu.querySelector('md-list> md-tile.selected')) {
            var selected = MDMenu.querySelector('md-list> md-tile.selected');
            MDMenu.scrollTop = selected.offsetTop - 8;
            if (MDMenu.scrollTop != selected.offsetTop) {
              MDMenu.style.top= (parseInt(MDMenu.style.top) - (selected.offsetTop - MDMenu.scrollTop - 8)) + 'px';
            }
          }
        }
        menuRect = MDMenu.getBoundingClientRect();
        if (menuRect.top<32) {
          MDMenu.style.top = '32px';
        } else if (viewPort.height - menuRect.bottom < 32) {
          MDMenu.style.top = (viewPort.height - 32 - menuRect.height) + 'px';
        }
        [].forEach.call(MDMenu.querySelectorAll('md-tile'), function(tile){
          tile.addEventListener('click', function(e){
            elTile= e.currentTarget;
            opt.selectEl.spanText.innerText = tile.querySelector('md-text').innerText;
            opt.selectEl.querySelector('[selected]').removeAttribute('selected');
            opt.selectEl.querySelector('[value="' + elTile.getAttribute('value') + '"]').setAttribute('selected','');
            opt.selectEl.setAttribute('value',elTile.getAttribute('value'));
            MDMenu.parentNode.removeChild(MDMenu);
          });
        });
      } else if (opt.outset) {
        if (opt.xPosition === "right") {
          MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
        } else {

        }

      } else {
        if (opt.xPosition === "right") {
          MDMenu.style.right=(viewPort.width - parentRect.right) + "px";
        } else {

        }
        if (opt.yPosition === "top") {
          MDMenu.style.top= parentRect.top + "px";

        } else {

        }
      }
    }
  }

  MDMenu.close = function() {
    MDMenu.style.height = "0px";
    MDMenu.addEventListener(transitionend, MDMenu.endOfTransition);
    MDMenu.status= "closed";
  }

  MDMenu.endOfTransition = function(e) {
    MDMenu.style.display="none";
    MDMenu.removeEventListener(transitionend, MDMenu.endOfTransition);
  }

  MDMenu.switch = function() {
    if (MDMenu.getAttribute('md-state') !== "open") {
      MDMenu.close();
    } else {
      MDMenu.open();
    }
  }
 
  MDMenu.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDMenu, config);
}