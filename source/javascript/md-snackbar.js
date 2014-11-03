var snackanimation = function(snackbar) {
  var position = snackbar.getAttribute('md-position');

  if(!snackbar.hasAttribute('md-notanimated')) {
    if(position.split(' ').indexOf('bottom') != -1) {    
        snackbar.style.transitionProperty='bottom, opacity';
        snackbar.style.transitionDuration="0.25s, 1s";      
        snackbar.style.bottom="24px";
        snackbar.style.opacity="1";
    } else {
        snackbar.style.transitionProperty='top, opacity';
        snackbar.style.transitionDuration="0.25s, 1s";      
        snackbar.style.top="0px";
        snackbar.style.opacity="1";      
    }
  }
}

