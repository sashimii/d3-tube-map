var tubeMap = require("../build/d3-tube-map.js");
var jsdom = require('jsdom');
var fs = require("fs");
var d3 = require("d3");
var svg2png = require("svg2png");

var width = 6400;
var height = 4096;

var map = tubeMap.tubeMap()
  .width(width)
  .height(height)
  .margin({
    top: height / 10,
    right: 0,
    bottom: height / 10,
    left: width / 7,
  });

var content = fs.readFileSync("./example/pubs.json");
var data = JSON.parse(content);

jsdom.env({
  html: '',
  features: { QuerySelector: true }, //you need query selector for D3 to work
  done: function (errors, window) {
    window.d3 = d3.select(window.document); //get d3 into the dom

    var svg = window.d3.select('body')
      .append('div')
      .attr('class', 'container')
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('width', width)
      .attr('height', height);

    svg.append('defs')
      .append('style')
      .attr('type', 'text/css')
      .text("@import url('https://fonts.googleapis.com/css?family=Hammersmith+One');");

    svg.datum(data).call(map);

    fs.writeFileSync('map.svg', window.d3.select('.container').html());

    var sourceBuffer = fs.readFileSync('map.svg');
    var outputBuffer = svg2png.sync(sourceBuffer, { width: width, height: height });
    fs.writeFileSync('map.png', outputBuffer);
  }
});
