var fs = require("fs");

var folders = ["src","resources","json-to-css"];
var file = "paperkit.readme";
var write = "";

function endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

function run(folder, file, write, tree) {
    var list = fs.readdirSync(folder);
    var hasReadme = false;
    write = write || "";
    [].forEach.call(list, function(item) {
        var path = folder + "/" + item;
        if (item === file) {
            hasReadme = true;
            console.log(folder + "/ has " + file);
        } else if (fs.lstatSync(path).isDirectory()) {
            console.log(path + " is a folder");
            if (tree) {
                run(path, file, write, true);
            }
        }
    });
    if (!hasReadme) {
        var banner = "PAPERKIT [" + folder + "] - " + file +
            "";
        var text = banner + write;
        fs.writeFile(folder + "/" + file, text);
        console.log(folder + "/ has not " + file + " - creating");
    }
}

function remove(folder, file, write, tree) {
    var list = fs.readdirSync(folder);
    [].forEach.call(list, function(item) {
        var path = folder + "/" + item;
        if (item === file) {
            fs.unlinkSync(path);
            console.log("Deleting " + path);
        } else if (fs.lstatSync(path).isDirectory()) {
            console.log(path + " is a folder");
            if (tree) {
                remove(path, file, write, true);
            }
        }
    });
}

[].forEach.call(folders, function(folder) {
    //remove(folder, file, write, true);
    run(folder, file, write, true);
});
