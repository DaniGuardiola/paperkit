var output = {
  type: "attribute",
  name: "md-height",
  values: [{
    name: "full",
    css: [{
      property: "height",
      value: "100%"
    }]
  }, {
    name: "x0",
    css: [{
      property: "height",
      value: "0"
    }]
  }]
}
var i = 1;
while (i < 16) {
  var name = "x" + i;
  var mval = (56 * i) + "px";
  var dval = (64 * i) + "px";
  var value = {
    name: name,
    responsive: [{
      target: ["watch", "mobile"],
      css: [{
        property: "height",
        value: mval
      }]
    }, {
      target: ["tablet", "desktop"],
      css: [{
        property: "height",
        value: dval
      }]
    }]
  }
  output.values.push(value);
  i++;
}
console.log(JSON.stringify(output, undefined, 2));
