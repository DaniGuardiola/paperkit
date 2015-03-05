var output = {
  type: "attribute",
  name: "md-shrink",
  css: [{
    property: "flex-shrink",
    value: '0'
  }],
  values: []
}
var i = 0;
while (i < 6) {
  var name = "f" + i;
  var value = {
    name: name,
    responsive: [{
      target: ["tablet", "desktop"],
      css: [{
        property: "flex-shrink",
        value: i + ''
      }]
    }]
  }
  output.values.push(value);
  i++;
}
console.log(JSON.stringify(output, undefined, 2));
