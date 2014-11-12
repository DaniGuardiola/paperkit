var output  = {
	type: "attribute",
	name: "md-width",
	values: []
}
var i = 1;
while (i < 41) {
	var name = "x" + i;
	var mval = (56 * i) + "px";
	var dval = (64 * i) + "px";
    var value = {
    	name: name,
    	responsive: [
    		{
    			target: ["watch","mobile"],
    			css: [
    				{
    					property: "width",
    					value: mval
    				}
    			]
    		},
    		{
    			target: ["tablet","desktop"],
    			css: [
    				{
    					property: "width",
    					value: dval
    				}
    			]
    		}
    	]
    }
    output.values.push(value);
    i++;
}
console.log(JSON.stringify(output, undefined, 2));