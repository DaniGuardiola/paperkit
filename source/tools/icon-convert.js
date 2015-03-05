var fs = require('fs');

var iconFiles = fs.readdirSync('bin/tmp/icons/svg/');
[].forEach.call(iconFiles, function(icon) {
  fs.readFile('bin/tmp/icons/svg/' + icon, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/<\?xml[\s\S]*xml:space="preserve">\s*/, '\x3Csvg xmlns=\"http:\x2F\x2Fwww.w3.org\x2F2000\x2Fsvg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\x3E');
    var result = result.replace(/\/>\s*/, '\x2F\x3E');
    var result = result.replace(/fill=\".*d=\"/, 'd=\"');
    fs.writeFile('bin/tmp/icons/svg/' + icon, result);
  });
});
