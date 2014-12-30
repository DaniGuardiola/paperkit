var output  = {
	type: "attribute",
	name: "md-flex",
	values: []
}
var i = 0;
while (i < 11) {
	var name = "f" + i;
    var value = {
    	name: name,
    	responsive: [
    		{
    			target: ["tablet","desktop"],
    			css: [
    				{
    					property: "flex-grow",
    					value: i+''
    				}
    			]
    		}
    	]
    }
    output.values.push(value);
    i++;
}
console.log(JSON.stringify(output, undefined, 2));