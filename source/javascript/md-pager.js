/**
 * MDPager Object.
 * Object code that extends HTML Element to support 
 * md-pager element functionality.
 */
var initMDPager= function(MDPager) {
	/**
	 * Moves to viewport specified page.
	 * @param  {integer} index Page to move to viewport.
	 */
	MDPager.moveToPage= function(index) {
		var pages= this.getElementsByTagName("md-page");
		for(var i=0; i<pages.length; i++) {
			pages[i].style.transform="translate(-"+ 100*index +"%)";
		}
	}
}