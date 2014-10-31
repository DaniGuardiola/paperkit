var winston = require('winston');
var fs =require('fs');
var Generator =require('../generator.js');
var argv = require('optimist').argv;

winston.level = 'info';

if(argv.v) {
  winston.level = 'debug';
}

var data =argv.file ? fs.readFileSync(argv.file) : fs.readFileSync('md-color.json');
var generator =new Generator(data);
console.log(generator.generate());
