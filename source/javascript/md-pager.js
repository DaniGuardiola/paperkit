/**
 * MDPager Object.
 * Object code that extends HTML Element to support
 * md-pager element functionality.
 */
var initMDPager = function(MDPager) {
  /**
   * Moves to viewport specified page.
   * @param  {integer} index Page to move to viewport.
   */
  MDPager.moveToPage = function(index) {
    var pages = this.getElementsByTagName("md-page");
    var numberOfPages = pages.length;
    pages[index].style.overflowY = "hidden";
    pages[index].scrollTop = 0;
    pages[0].style.marginLeft = "-" + (100 * index) + "%";
    pages[index].style.overflowY = "";
  }
}
