/**
 * Initializes components including their subtree
 * @param  {node|array}   what     Element or elements
 * @param  {function} callback Fires when initialization is completed
 */
md.init = function(what, callback) {
    "use strict";
    var i;
    if (what.constructor === Array) {
        for (i = what.length - 1; i >= 0; i--) {
            if (what[i].nodeType) {
                md.init(what[i]);
            }
        }
    } else if (what.nodeType) {
        // Functionality
        md.build(what);

        for (i = 0; i < what.children.length; i++) {
            md.init(what.children[i]);
        }
    }
};

/**
 * Builds components (add the methods and render the subtree if any)
 * @param  {node|array} what The element or elements
 */
md.build = function(what) {
    "use strict";
    var i;
    if (what.constructor === Array) {
        for (i = what.length - 1; i >= 0; i--) {
            md.build(what[i]);
        }
    } else if (what.nodeType) {
        console.log("Building element <" + what.tagName.toLowerCase() + ">");
    }

};

md.options.register = [
    ["toolbar", "body>md-toolbar", "md-toolbar"]
];
/* [header, header.title, header.hamburguer, header.more, header.lens,
content, bottombar,tabs, pager, sidenav, sidenav.toolbar, sidenav.list,
sidenav.account, rightnav, rightnav.toolbar, fab, modal] */
for (var i = md.options.register.length - 1; i >= 0; i--) {
    md[md.options.register[i][0]] = false;
}

/**
 * Registers components if they are top level
 * @param  {node|array} what Element or elements
 */
md.register = function(what) {
    "use strict";
    if (!what.nodeType) {
        return false;
    }
    if (what) {}
};
