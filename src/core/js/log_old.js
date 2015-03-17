md.options.log = {
    banner: "PK ",
    color: "#000",
    style: " font-family: Roboto, Arial; font-size: 13px; font-weight: 600;",
    mode: "log",
    types: {
        log: {
            color: "#000",
            mode: "log"
        },
        error: {
            color: "#F44336",
            mode: "error"
        },
        warn: {
            color: "#F57F17",
            mode: "warn"
        },
        info: {
            color: "#0D47A1",
            mode: "info"
        }
    }
};
md.log = function(what, type, opt) {
    "use strict";
    // Sanity checks
    if (!what) {
        md.log("[md.log] The \"what\" parameter is required", "error");
        return false;
    }
    if (typeof what !== "string") {
        md.log("[md.log] The \"what\" parameter must be string, it is " + typeof what + " instead", "error");
        return false;
    }
    type = type || "log";
    opt = opt || {};
    if (!md.options.log.types[type]) {
        md.log("[md.log] Type \"" + type + "\" not found, switching to \"log\"", "warn");
        type = "log";
    }

    // Getting configuration
    var option = md.options.log.types[type];
    var banner = opt.banner || option.banner || md.options.log.banner;
    var color = opt.color || option.color || md.options.log.color;
    var style = opt.style || option.style || md.options.log.style;
    var mode = opt.mode || option.mode || md.options.log.mode;
    if (!console[mode]) {
        md.log("[md.log] Mode \"" + mode + "\" not available on console object, switching to \"log\"", "warn");
        mode = "log";
    }
    console[mode]("%c" + banner + what, "color: " + color + ";" + style);
};
