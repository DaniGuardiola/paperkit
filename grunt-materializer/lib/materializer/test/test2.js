/* global require, fs, winston, mdcssParser */
fs = require("fs");
winston = require("winston");
mdcssParser = require("../mdcssparser.js");

var argv = require("optimist").argv;

winston.level = "info";

if (argv.v) {
  winston.level = "debug";
}

var parser = new mdcssParser();
console.log(parser.parse(".class1 { md-color: red 100; md-typo: subhead; }"));
