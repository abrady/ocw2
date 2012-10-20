// this is the main file where your application startup begins

require('./sample-view').init();

var SampleView = require('./sample-view').SampleView;
var ButtonExample = require('./sample-view').ButtonExample;

(new SampleView({})).placeIn(document.body);
