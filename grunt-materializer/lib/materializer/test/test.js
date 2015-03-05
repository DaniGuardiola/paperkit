/* global require, fs, winston, Generator */
fs = require("fs");
winston = require("winston");
Generator = require("../generator.js");
var argv = require("optimist").argv;
var FILEPATH = "../../../../source/style";

winston.level = "info";

if (argv.v) {
  winston.level = "debug";
}

var data = argv.file ? fs.readFileSync(FILEPATH + "/" + argv.file) : fs.readFileSync(FILEPATH + "/md-typo.json");
var gen = new Generator(data);
console.log(gen.generate());
