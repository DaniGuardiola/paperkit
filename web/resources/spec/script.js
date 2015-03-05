/* global Paperkit, Prism, contentHTML */
/* exported nextPaperkit, backPaperkit, toggleLayers, showHelp, toggleFullscreen, getLink, showCode */

// Change title
document.title = document.title.replace("Google design guidelines", "Google guidelines - Paperkit edition");

var mdpath = document.querySelector("script[paperkit-path]").getAttribute("paperkit-path");

var paperkitCSS = document.createElement("link");
paperkitCSS.setAttribute("href", "../../paperkit-min/paperkit.css");
paperkitCSS.setAttribute("rel", "stylesheet");
var prismCSS = document.createElement("link");
prismCSS.setAttribute("href", "../../resources/prism.css");
prismCSS.setAttribute("rel", "stylesheet");
var styleCSS = document.createElement("link");
styleCSS.setAttribute("href", "../../resources/spec/style.css");
styleCSS.setAttribute("rel", "stylesheet");
var paperkitJS = document.createElement("script");
paperkitJS.setAttribute("src", "../../paperkit-min/paperkit.js");
paperkitJS.setAttribute("rel", "stylesheet");
var prismJS = document.createElement("script");
prismJS.setAttribute("src", "../../resources/prism.js");
prismJS.setAttribute("rel", "stylesheet");

document.head.appendChild(paperkitCSS);
document.head.appendChild(prismCSS);
document.head.appendChild(styleCSS);
document.head.appendChild(paperkitJS);
var paperkit;
paperkitJS.addEventListener("load", function() {
  paperkit = new Paperkit();
});

var nextPage = false;
var backPage = false;

function anchorJump(id, onlyLink) {
  if (!onlyLink) {
    location.href = "#" + id;
    document.body.scrollTop = document.body.scrollTop - 128;
  }
  window.history.pushState(id, document.title, "#" + id);
  setTimeout(function() {
    window.history.pushState(id, document.title, "#" + id);
  }, 50);
  setTimeout(function() {
    window.history.pushState(id, document.title, "#" + id);
  }, 150);
  setTimeout(function() {
    window.history.pushState(id, document.title, "#" + id);
  }, 250);
}

window.addEventListener("load", function() {
  if (document.querySelector(".footer-grid-R>a")) {
    nextPage = document.querySelector(".footer-grid-R>a").href;
  }
  if (document.querySelector(".footer-grid-L>a")) {
    backPage = document.querySelector(".footer-grid-L>a").href;
  }

  // Saving code before paperkit inits and proccesses it
  [].forEach.call(document.querySelectorAll(".paperkit-paper"), function(paper) {
    var example = paper.querySelector(".example");
    if (example) {
      paper.paperkitCode = example.innerHTML.toString();
    } else {
      paper.paperkitCode = "There is no code! You shoudn't see this message, did you add the 'no-controls' class ? ";
    }
  });

  [].forEach.call(document.querySelectorAll(".paperkit-space"), function(paper) {
    if (paper) {
      contentHTML = paper.innerHTML;
      paper.innerHTML = "";
      var bg = document.createElement("div");
      bg.classList.add("bg");
      paper.appendChild(bg);
      var content = document.createElement("div");
      content.innerHTML = contentHTML;
      content.classList.add("content-pre");
      paper.appendChild(content);
      var computedHeight = window.getComputedStyle(paper).height;
      if (paper.classList.contains("paper-style") && !paper.classList.contains("disable-height-calc")) {
        paper.style.height = (parseInt(computedHeight) + 32) + "px";
      } else {
        paper.style.height = computedHeight;
      }
      content.classList.remove("content-pre");
      content.classList.add("content");
    }
  });

  document.body.appendChild(prismJS);
  prismJS.addEventListener("load", function() {
    Prism.highlightAll();
  });
  paperkit.init();

  // Check anchor link
  var url = window.location.hash,
    idx = url.indexOf("#");
  var anchor = idx !== -1 ? url.substring(idx + 1) : false;
  if (anchor && anchor.indexOf("paperkit-") !== -1) {
    anchorJump(anchor);
  }

  // Jump to anchor when url changes
  window.addEventListener("hashchange", function() {
    var url = window.location.hash,
      idx = url.indexOf("#");
    var anchor = idx !== -1 ? url.substring(idx + 1) : false;
    if (anchor && anchor.indexOf("paperkit-") !== -1) {
      anchorJump(anchor);
    }
  });

  // Adding help button
  var helpButton = document.createElement("md-icon-button");
  helpButton.id = "paperkit-help-button";
  helpButton.setAttribute("md-image", "icon:help");
  helpButton.setAttribute("md-fill", "white");
  helpButton.setAttribute("md-action", "custom: showHelp");
  paperkit.initElement(helpButton);
  document.body.appendChild(helpButton);

  // Adding warning button
  var warningButton = document.createElement("md-icon-button");
  warningButton.id = "paperkit-warning-button";
  warningButton.setAttribute("md-image", "icon:warning");
  warningButton.setAttribute("md-fill", "white");
  warningButton.setAttribute("md-action", "custom: showWarning");
  paperkit.initElement(warningButton);
  document.body.appendChild(warningButton);


  // Adding layers button
  var layersButton = document.createElement("md-icon-button");
  layersButton.id = "paperkit-layers-button";
  layersButton.setAttribute("md-image", "icon:layers_clear");
  layersButton.setAttribute("md-fill", "white");
  layersButton.setAttribute("md-action", "custom: toggleLayers");
  paperkit.initElement(layersButton);
  document.body.appendChild(layersButton);


  // Adding back and next buttons
  var nextButton = document.createElement("md-icon-button");
  nextButton.id = "paperkit-next-button";
  nextButton.setAttribute("md-image", "icon:arrow_forward");
  nextButton.setAttribute("md-fill", "white");
  nextButton.setAttribute("md-action", "custom: nextPaperkit");
  paperkit.initElement(nextButton);
  document.body.appendChild(nextButton);
  var backButton = document.createElement("md-icon-button");
  backButton.id = "paperkit-back-button";
  backButton.setAttribute("md-image", "icon:arrow_back");
  backButton.setAttribute("md-fill", "white");
  backButton.setAttribute("md-action", "custom: backPaperkit");
  paperkit.initElement(backButton);
  document.body.appendChild(backButton);

  // Replacing logo
  var logo = document.getElementById("logo");
  logo.style.height = "auto";
  logo.style.padding = "5px 10px";
  logo.style.cursor = "pointer";
  logo.addEventListener("click", function() {
    window.location.href = "/";
  });
  var logoImg = logo.querySelector("img");
  logoImg.style.height = "auto";
  logoImg.style.width = "auto";
  logoImg.setAttribute("src", "/resources/brand/banner.png");

  // Adding legal content
  var legal = document.querySelector("#side-nav > div > div.legal");
  legal.innerHTML = "<p class='copyright'>Google &copy;</p><p class='copyright'>Modified by Paperkit for informational purposes</p><p class='copyright'><a href='https: //www.google.com/design/spec/'>Go to the original spec</a></p><a href='http://www.google.com/intl/en/policies/privacy/'>Privacy</a> &amp; <a href='http://www.google.com/intl/en/policies/terms/'>Terms</a>";

  [].forEach.call(document.querySelectorAll(".paperkit-space"), function(paper) {
    var image = document.createElement("img");
    image.classList.add("logo");
    image.setAttribute("src", mdpath + "resources/brand/logo-white.png");
    paper.appendChild(image);
  });


  // Adding stuff to papers
  [].forEach.call(document.querySelectorAll(".paperkit-paper"), function(paper) {
    var image = document.createElement("img");
    image.classList.add("logo");
    image.setAttribute("src", mdpath + "resources/brand/logo.png");
    paper.appendChild(image);
    if (!paper.classList.contains("no-controls")) {
      var buttonDiv = document.createElement("div");
      buttonDiv.classList.add("controls");
      buttonDiv.setAttribute("md-shadow", "shadow-1");
      buttonDiv.setAttribute("md-fill", "white");
      buttonDiv.setAttribute("md-flex", "display wrap");
      if (!paper.classList.contains("no-devices")) {
        var devices = document.createElement("div");
        devices.classList.add("devices");
        devices.setAttribute("md-flex", "display");
        var devicesSpace = document.createElement("md-space");
        devices.appendChild(devicesSpace);
        if (!paper.classList.contains("no-mobile")) {
          var deviceMobile = document.createElement("md-icon-button");
          deviceMobile.classList.add("device", "mobile");
          deviceMobile.setAttribute("md-image", "icon:smartphone");
          deviceMobile.setAttribute("md-action", "custom:changeDevice");
          devices.appendChild(deviceMobile);
        }
        if (!paper.classList.contains("no-tablet")) {
          var deviceTablet = document.createElement("md-icon-button");
          deviceTablet.classList.add("device", "tablet");
          deviceTablet.setAttribute("md-image", "icon:tablet");
          deviceTablet.setAttribute("md-action", "custom:changeDevice");
          devices.appendChild(deviceTablet);
        }
        if (!paper.classList.contains("no-desktop")) {
          var deviceDesktop = document.createElement("md-icon-button");
          deviceDesktop.classList.add("device", "desktop");
          deviceDesktop.setAttribute("md-image", "icon:computer");
          deviceDesktop.setAttribute("md-action", "custom:changeDevice");
          devices.appendChild(deviceDesktop);
        }
        buttonDiv.appendChild(devices);
      }
      var space = document.createElement("div");
      space.style.height = "48px";
      space.style.width = "1px";
      space.style.flexGrow = "1";
      buttonDiv.appendChild(space);
      if (!paper.classList.contains("no-link")) {
        var link = document.createElement("md-icon-button");
        link.setAttribute("md-image", "icon:link");
        link.setAttribute("md-action", "custom:getLink");
        buttonDiv.appendChild(link);
      }
      if (!paper.classList.contains("no-fullscreen")) {
        var fullscreen = document.createElement("md-icon-button");
        fullscreen.setAttribute("md-image", "icon:fullscreen");
        fullscreen.setAttribute("md-action", "custom:toggleFullscreen");
        buttonDiv.appendChild(fullscreen);
      }
      if (!paper.classList.contains("no-showcode")) {
        var button = document.createElement("md-button");
        button.setAttribute("md-typo", "button");
        button.textContent = "Show code";
        button.setAttribute("md-buttontype", "flat-dark");
        button.setAttribute("md-font-color", "white");
        button.setAttribute("md-action", "custom:showCode");
        buttonDiv.appendChild(button);
      }
      paper.appendChild(buttonDiv);
    }
    paperkit.initElement(paper);
  });
});

function nextPaperkit() {
  var scroll = document.body.scrollTop;
  var found = false;
  [].forEach.call(document.querySelectorAll(".paperkit-paper,.paperkit-space"), function(element) {
    var elScroll = element.offsetTop;
    if (scroll < elScroll - 128 && !found) {
      found = true;
      document.body.scrollTop = elScroll - 128;
    }
  });
  if (!found || ((window.innerHeight + scroll) >= document.body.offsetHeight)) {
    if (nextPage) {
      location.href = nextPage;
    } else {
      document.body.scrollTop = document.body.offsetHeight;
    }
  }
}

function backPaperkit() {
  var scroll = document.body.scrollTop;
  var found = false;
  var last = false;

  [].forEach.call(document.querySelectorAll(".paperkit-paper,.paperkit-space"), function(element) {
    var elScroll = element.offsetTop;
    if (scroll > elScroll - 128 && !found) {
      last = elScroll;
    } else if (last) {
      document.body.scrollTop = last - 128;
      found = true;
    }
  });
  if (!found) {
    if (backPage) {
      location.href = backPage;
    } else {
      document.body.scrollTop = 0;
    }
  }
}

function toggleLayers(el) {
  if (document.body.classList.contains("no-paperkit")) {
    document.body.classList.remove("no-paperkit");
    el.setAttribute("md-image", "icon:layers");
  } else {
    document.body.classList.add("no-paperkit");
    el.setAttribute("md-image", "icon:layers_clear");
  }
}

function showHelp() {
  console.log("COMING SOON");
}

function hideIframe(el) {
  if (el.iframe) {
    el.iframe.parentNode.removeChild(el.iframe);
    el.classList.remove("iframe");
    el.iframe = null;
  }
}

function showIframe(el) {
  if (!el.iframe) {
    var example = el.querySelector(".example").cloneNode();
    example.innerHTML = el.querySelector(".example").innerHTML;
    console.log(example);
    example.style.width = "100%";
    example.style.height = "100%";
    var wrapper = document.createElement("div");
    wrapper.appendChild(example);
    example = wrapper.innerHTML.toString();
    var content = "<html><head><link rel='stylesheet' href='" + mdpath + "paperkit-min/paperkit.css'><script src='" + mdpath + "'paperkit-min/paperkit.js'><script type='text/javascript'>var paperkit = new Paperkit();window.addEventListener('load', function(){paperkit.init();<\/script></head><body>" + example + "</body></html>";
    var iframe = document.createElement("iframe");
    iframe.classList.add("example-iframe");
    el.insertBefore(iframe, el.querySelector(".example"));
    el.iframe = iframe;
    var doc = iframe.document;
    if (iframe.contentDocument) {
      doc = iframe.contentDocument; // For NS6
    } else if (iframe.contentWindow) {
      doc = iframe.contentWindow.document; // For IE5.5 and IE6
    }
    // Put the content in the iframe
    doc.open();
    doc.writeln(content);
    doc.close();
  }
  el.classList.add("iframe");
}

function changeDevice(el, string, element) {
  var button;
  if (string === true) {
    button = el;
    el = element;
  } else {
    button = el;
    el = el.parentNode.parentNode.parentNode;
  }
  if (button === "desktop" || (button.classList && button.classList.contains("desktop"))) {
    hideIframe(el);
    el.classList.remove("mobile", "tablet");
  } else if (button === "tablet" || (button.classList && button.classList.contains("tablet"))) {
    showIframe(el);
    el.classList.remove("mobile");
    el.classList.add("tablet");
  } else if (button === "mobile" || (button.classList && button.classList.contains("mobile"))) {
    showIframe(el);
    el.classList.remove("tablet");
    el.classList.add("mobile");
  }
}

function toggleFullscreen(el) {
  var button = el;
  el = el.parentNode.parentNode;
  if (el.classList.contains("fullscreen")) {
    paperkit.greylayer.hide();
    changeDevice("desktop", true, el);
    el.style.overflow = "";
    document.querySelector("html").style.overflow = "";
    button.setAttribute("md-image", "icon:fullscreen");
    el.classList.remove("fullscreen");
  } else {
    paperkit.greylayer.show();
    if (paperkit.viewport.get().width < 768 || el.classList.contains("show-mobile")) {
      changeDevice("mobile", true, el);
    } else if (paperkit.viewport.get().width < 992 || el.classList.contains("show-tablet")) {
      changeDevice("tablet", true, el);
    } else if (el.classList.contains("show-desktop")) {
      changeDevice("desktop", true, el);
    }
    if (el.code && el.querySelector(".code").classList.contains("on")) {
      el.style.overflow = "";
    } else {
      el.style.overflow = "hidden";
    }
    document.querySelector("html").style.overflow = "hidden";
    button.setAttribute("md-image", "icon:fullscreen_exit");
    el.classList.add("fullscreen");
  }
}

function getLink(el) {
  el = el.parentNode.parentNode;
  var onlyLink = false;
  if (el.classList.contains("fullscreen")) {
    onlyLink = true;
  }
  anchorJump(el.id, onlyLink);
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, "g"), replace);
}

function showCode(el) {
  el = el.parentNode.parentNode;
  if (!el.code) {
    var code = document.createElement("div");
    code.classList.add("code");
    code.show = function() {
      this.classList.add("on");
      el.querySelector(".controls md-button").textContent = "Hide code";
      if (el.classList.contains("fullscreen")) {
        code.scrollIntoView();
        el.style.overflow = "";
      }
    };
    code.hide = function() {
      this.classList.remove("on");
      el.querySelector(".controls md-button").textContent = "Show code";
      if (el.classList.contains("fullscreen")) {
        if (el.iframe) {
          el.iframe.scrollIntoView();
        }
        el.style.overflow = "hidden";
      }
    };
    var pre = document.createElement("pre");
    pre.classList.add("language-markup");
    var codeTag = document.createElement("code");
    var codeText = el.paperkitCode;
    codeText = replaceAll("<", "&lt;", codeText);
    codeText = replaceAll(">", "&gt;", codeText);
    codeTag.innerHTML = codeText;
    pre.appendChild(codeTag);
    code.appendChild(pre);
    el.appendChild(code);
    el.code = code;
    Prism.highlightAll();
    el.code.show();
  } else if (el.code.classList.contains("on")) {
    el.code.hide();
  } else {
    el.code.show();
  }
}
