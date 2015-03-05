var request = require('request');
var fs = require('fs'); // fs para escrever diretamente para o disco, much win
var Puid = require('puid');
var puid = new Puid(); // Isso aqui gera ID Ãºnicos, assim nunca vai sobreescrever
var path = require('path');
var Promise = require('bluebird');

var download = function(arquivo, pasta, callback) {
  var p = new Promise(function(resolve, reject) {
    var id = puid.generate();
    var dest = path.join(pasta, id);
    var writeStream = fs.createWriteStream(dest);

    // Avisando a promise que acabamos por aqui
    writeStream.on('finish', function() {
      resolve(id);
    });

    // Capturando erros da write stream
    writeStream.on('error', function(err) {
      fs.unlink(dest, reject.bind(null, err));
    });

    var readStream = request.get(arquivo);

    // Capturando erros da request stream
    readStream.on('error', function(err) {
      fs.unlink(dest, reject.bind(null, err));
    });

    // Iniciando a transferÃªncia de dados
    readStream.pipe(writeStream);
  });

  // Manter compatibilidade com callbacks
  if (!callback)
    return p;

  p.then(function(id) {
    callback(null, id);
  }).catch(function(err) {
    callback(err);
  });
};

module.exports = download;
