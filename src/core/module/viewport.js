// TODO: add tags to be able to filter
"use strict";

/**
 * Module (core) - Viewport utilities for Material Design responsiveness
 *
 * Function: [md.viewport()]{@link md.viewport~main}
 * 
 * Returns:
 *
 * - width
 * - height
 * - orientation (portrait or landscape)
 * - portrait (boolean)
 * - landscape (boolean)
 * - device (mobile, tablet or desktop)
 * - mobile (boolean)
 * - tablet (boolean)
 * - desktop (boolean)
 * - min
 * - max
 *
 * Min and max contains the values for each device,
 * example: tablet: true, max.desktop: true, max.mobile: false
 *
 * Makes available the events md-viewport-change,
 * md-device-change and md-orientation-change
 *
 * @example
 * if (md.viewport().device === "mobile") {
 *   // Some mobile-specific code
 * }
 * if (md.viewport().min.tablet) {
 *   // Tablet and desktop code
 * }
 * if (md.viewport().max.tablet) {
 *   // Tablet and mobile code
 * }
 * @namespace md.viewport
 *
 * 
 * @author [Dani Guardiola]{@link http://daniguardiola.me/}
 * @license [Apache-2.0]{@link http://www.apache.org/licenses/LICENSE-2.0}
 * @version 0.0.1
 */

md.include({
  "type": "module",
  "name": "viewport",
  "core": true,
  "asGetter": true
}, /** @lends md.viewport */ function() {

  /**
   * Main function, published as md.viewport(option)
   *
   * Logs a message
   * @param  {string} option Optional - "max" or "min"
   */
  var main = function() {
    // Setup
    var e = window;
    var a = "inner";
    var output = {
      mobile: false,
      tablet: false,
      desktop: false,
      landscape: false,
      portrait: false,
      max: {
        mobile: false,
        tablet: false,
        desktop: false
      },
      min: {
        mobile: false,
        tablet: false,
        desktop: false
      }
    };
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }

    // Dimensions
    output.width = e[a + "Width"];
    output.height = e[a + "Height"];

    // Device
    if (output.width < 768) {
      output.device = "mobile";
      output.mobile = true;
      output.min.mobile = true;
      output.max.mobile = true;

      output.max.tablet = true;
      output.max.desktop = true;
    } else if (output.width > 768 && output.width < 992) {
      output.device = "tablet";
      output.tablet = true;
      output.min.tablet = true;
      output.max.tablet = true;

      output.max.desktop = true;
      output.min.mobile = true;
    } else {
      output.device = "desktop";
      output.desktop = true;
      output.min.desktop = true;
      output.max.desktop = true;

      output.min.mobile = true;
      output.min.tablet = true;
    }

    // Orientation
    if (output.width < output.height) {
      output.orientation = "portrait";
      output.portrait = true;
    } else {
      output.orientation = "landscape";
      output.landscape = true;
    }
    return output;
  };

  /**
   * Resize event management,
   * modified by Dani Guardiola
   * 
   * @name resizeEvent
   * @author [Dominik Porada]{@link https://github.com/porada}
   * @license http://porada.mit-license.org/ MIT
   */
  (function(window) {
    var currentOrientation, debounce, dispatchResizeEndEvent, document, getCurrentOrientation,
    initialOrientation, resizeDebounceTimeout, lastDevice, lastOrientation, v;
    document = window.document;
    v = main();
    lastDevice = v.device;
    lastOrientation = v.orientation;
    if (!window.addEventListener) {
      return;
    }
    dispatchResizeEndEvent = function() {
      var event = new CustomEvent("md-viewport-change");

      // Viewport details
      var viewport = main();
      for (var k in viewport) {
        event[k] = viewport[k];
      }
      window.dispatchEvent(event);

      // Device change
      if (viewport.device !== lastDevice) {
        lastDevice = viewport.device;
        event = new Event("md-device-change");
        event.device = viewport.device;
        event.min = viewport.min;
        event.max = viewport.max;
        window.dispatchEvent(event);
      }

      // Orientation change
      if (viewport.orientation !== lastOrientation) {
        lastOrientation = viewport.orientation;
        event = new Event("md-orientation-change");
        event.orientation = viewport.orientation;
        window.dispatchEvent(event);
      }
    };
    getCurrentOrientation = function() {
      return Math.abs(+window.orientation || 0) % 180;
    };
    initialOrientation = getCurrentOrientation();
    currentOrientation = null;
    resizeDebounceTimeout = null;
    debounce = function() {
      currentOrientation = getCurrentOrientation();
      if (currentOrientation !== initialOrientation) {
        dispatchResizeEndEvent();
        initialOrientation = currentOrientation;
        return;
      } else {
        clearTimeout(resizeDebounceTimeout);
        resizeDebounceTimeout = setTimeout(dispatchResizeEndEvent, 100);
        return;
      }
    };
    return window.addEventListener("resize", debounce, false);
  })(window);

  return main;
});
