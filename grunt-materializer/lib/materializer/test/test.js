fs = require('fs')
winston = require('winston')
Generator = require('../generator.js')
var argv = require('optimist').argv;

winston.level = 'info';

if(argv.v) {
  winston.level = 'debug';
}

var data = argv.file ? fs.readFileSync(argv.file) : fs.readFileSync('./md-typo.json');
var gen = new Generator(data);
console.log(gen.generate());
