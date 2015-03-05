var output = {
  type: "attribute",
  name: "md-flex",
  values: [{
    name: "no-shrink",
    css: [{
      property: "flex-shrink",
      value: "0"
    }]
  }, {
    name: "shrink",
    css: [{
      property: "flex-shrink",
      value: "1"
    }]
  }, {
    name: 'display',
    css: [{
      property: "display",
      value: 'flex'
    }]
  }, {
    name: 'no-wrap',
    css: [{
      property: "flex-wrap",
      value: 'nowrap'
    }]
  }, {
    name: 'wrap',
    css: [{
      property: "flex-wrap",
      value: 'wrap'
    }]
  }, {
    name: 'wrap-reverse',
    css: [{
      property: "flex-wrap",
      value: 'wrap-reverse'
    }]
  }, {
    name: 'column',
    css: [{
      property: "flex-direction",
      value: 'column'
    }]
  }, {
    name: 'row',
    css: [{
      property: "flex-direction",
      value: 'row'
    }]
  }]
}
var i = 0;
while (i < 11) {
  var name = "f" + i;
  var value = {
    name: name,
    responsive: [{
      target: ["tablet", "desktop"],
      css: [{
        property: "flex-grow",
        value: i + ''
      }]
    }]
  }
  output.values.push(value);
  i++;
}
console.log(JSON.stringify(output, undefined, 2));
