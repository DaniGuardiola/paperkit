var snackanimation = function(snackbar) {
  var position = snackbar.getAttribute('md-position');

  if(position.split(' ').indexOf('bottom') != -1) {
    if(!snackbar.hasAttribute('md-notanimated')) {
      snackbar.style.transitionProperty='bottom, opacity';
      snackbar.style.transitionDuration="0.25s, 1s";      
      snackbar.style.bottom="24px";
      snackbar.style.opacity="1";
    }
  } else if(position.split(' ').indexOf('top') != -1) {

  }
}

