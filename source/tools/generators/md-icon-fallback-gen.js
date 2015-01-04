var fs = require('fs');

var output  = {
	type: "tag",
	name: "md-icon",
	attributes: [
        {
            type: "attribute",
            name: "md-image",
            values: []
        }
    ]
}
var iconFiles = fs.readdirSync("/home/dani/proyectos/materializer/bin/materializer/resources/icon/");
[].forEach.call(iconFiles, function(icon){
    icon = icon.split('.')[0];
    var value = {
        name: icon,
        css: [
            {
                "property": "background-image",
                "value": "resources/icon/" + icon + ".svg"
            }
        ]
    }
    output.attributes[0].values.push(value);
});
console.log(JSON.stringify(output, undefined, 2));