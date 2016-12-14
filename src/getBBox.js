var phantom = require("phantom");
var fs = require('fs');

var _ph, _page, _outObj;

phantom.create().then(ph => {
  _ph = ph;
  return _ph.createPage();
}).then(page => {
  _page = page;
  return _page.open('./test.svg');
}).then(status => {
  console.log(status);

  var title = _page.evaluate(function () {
    var labels = document.querySelectorAll('.label');

    var labelBBoxes = [];

    for (var i = 0; i < labels.length; i++) {
      labelBBoxes.push({ id: labels[i].id, BBox: labels[i].getBBox() });
    }

    return labelBBoxes;
  }).then(html => fs.writeFileSync('hitboxes.json', JSON.stringify(html))
    )
    .catch(e => console.log(e));

  return _page.property('content');
}).then(content => {
  //console.log(content);
  _page.close();
  _ph.exit();
}).catch(e => console.log(e));