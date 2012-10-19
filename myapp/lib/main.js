// this is the main file where your application startup begins

require('./sample-view');

var SampleView = require('./sample-view').SampleView;

(new SampleView({})).placeIn(document.body);