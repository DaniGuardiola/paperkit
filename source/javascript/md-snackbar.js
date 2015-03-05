var initMDSnackBar = function(MDSnackBar) {
  MDSnackBar.animationIn = function() {
    var position = this.getAttribute('md-position');

    if (!this.hasAttribute('md-notanimated')) {
      if (position.split(' ').indexOf('bottom') != -1) {
        this.style.transitionProperty = 'bottom, opacity';
        this.style.transitionDuration = "0.25s, 0.5s";
      } else {
        this.style.transitionProperty = 'top, opacity';
        this.style.transitionDuration = "0.25s, 0.5s";
      }
      this.setAttribute("md-notanimated", "");
    }
  };

  MDSnackBar.animationOut = function() {
    var position = this.getAttribute('md-position');

    if (position.split(' ').indexOf('bottom') != -1) {
      this.style.transitionProperty = 'opacity';
      this.style.transitionDuration = "0.5s";
      this.style.opacity = "0";
    } else {
      this.style.transitionProperty = 'opacity';
      this.style.transitionDuration = "0.5s";
      this.style.opacity = "0";
    }
  };

  MDSnackBar.animationEnd = function() {
    var position = this.getAttribute('md-position');

    this.style.transitionProperty = '';
    this.style.transitionDuration = "";
    this.style.opacity = "";
    this.removeAttribute("md-notanimated");

    this.removeEventListener(transitionend, this.animationEnd);
  };

  MDSnackBar.animate = function() {
    this.animationIn();
    var _this = this;
    setTimeout(function() {
      _this.animationOut();
      _this.addEventListener(transitionend, _this.animationEnd);
    }, 2000);
  };

  MDSnackBar.createdCallback = function() {
    var action = this.getAttribute('md-action');

    if (action) {
      this.attributeChangedCallback('md-action', '', action);
    }
  };
}
