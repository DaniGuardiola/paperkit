/* global require, __dirname */
var fs = require("fs");
var path = require("path");
var download = require("./download");

var forceOnNew = false;


function strEndsWith(str, suffix) {
  return str.match(suffix + "$") === suffix;
}

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) {
        return done(null, results);
      }
      file = dir + "/" + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if (strEndsWith(file, ".html")) {
            results.push(file);
          }
          /*else {
            results.push("NOT HTML: "+file);
          }*/
          next();
        }
      });
    })();
  });
};

walk(__dirname, function(err, results) {
  if (err) {
    throw err;
  }
  var sanity = false;
  [].forEach.call(results, function(file) {
    if (!sanity) {

      console.log("FILE TO PROCCESS IS " + file);


      var dirname = path.dirname(file);
      fs.readFile(file, "utf8", function(err, data) {
        fs.writeFile(file + ".old", data);
        if (err) {
          return console.log(err);
        }
        var webm, mp4;
        if (fs.existsSync(file + ".old") && !forceOnNew) {
          fs.readFile(file + ".old", "utf8", function(err, dataOld) {
            if (err) {
              return console.log(err);
            }
            webm = dataOld.match(/https:\/\/[^"]*\.webm/g);
            mp4 = dataOld.match(/https:\/\/[^"]*\.mp4/g);
          });
        } else {
          webm = data.match(/https:\/\/[^"]*\.webm/g);
          mp4 = data.match(/https:\/\/[^"]*\.mp4/g);
        }
        var newData = data.replace(/https:\/\/[^"]*\.webm/g, function(url) {
          var myRegexp = /\/([^\/]*\.webm)/;
          var match = myRegexp.exec(url);

          return match[1];
        });
        newData = newData.replace(/https:\/\/[^"]*\.mp4/g, function(url) {
          var myRegexp = /\/([^\/]*\.mp4)/;
          var match = myRegexp.exec(url);

          return match[1];
        });
        fs.writeFile(file, newData);
        if (mp4 && webm) {
          [].forEach.call(mp4, function(vid) {
            var filename = path.basename(vid);
            if (fs.existsSync(dirname + "/" + filename)) {
              console.log(filename + " already exists");
            } else {
              download(vid, dirname, function(err, id) {
                if (err) {
                  throw err;
                }
                console.log("Saved MP4. Name: " + filename + ", dir: " + dirname + ", id: " + id);
                fs.rename(dirname + "/" + id, dirname + "/" + filename);
              });
            }
          });
          [].forEach.call(webm, function(vid) {
            var filename = path.basename(vid);
            if (fs.existsSync(dirname + "/" + filename)) {
              console.log(filename + " already exists");
            } else {
              download(vid, dirname, function(err, id) {
                if (err) {
                  throw err;
                }
                console.log("Saved WEBM. Name: " + filename + ", dir: " + dirname + ", id: " + id);
                fs.rename(dirname + "/" + id, dirname + "/" + filename);
              });
            }
          });
        } else {
          console.log("File has no vids or has been proccessed already");
        }
      });


      //sanity = true;
    }
  });
});
