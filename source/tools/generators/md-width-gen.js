var output = {
  type: "attribute",
  name: "md-width",
  values: [{
    name: "full",
    css: [{
      property: "width",
      value: "100%"
    }]
  }, {
    name: "x0",
    css: [{
      property: "width",
      value: "0"
    }]
  }]
};

var i = 1;
while (i < 41) {
  var name = "x" + i;
  var mval = (56 * i) + "px";
  var dval = (64 * i) + "px";
  var value = {
    name: name,
    responsive: [{
      target: ["watch", "mobile"],
      css: [{
        property: "width",
        value: mval
      }]
    }, {
      target: ["tablet", "desktop"],
      css: [{
        property: "width",
        value: dval
      }]
    }]
  };
  output.values.push(value);
  i++;
}
for (var i = 1; i <= 20; i++) {
  var value = {
    name: "c" + i,
    css: [{
      property: "flex-grow",
      value: "" + i
    }, {
      property: "flex-shrink",
      value: "0"
    }]
  };
  output.values.push(value);
}
console.log(JSON.stringify(output, undefined, 2));
