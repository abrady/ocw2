// this is a "directory module" that can be referenced by its directory name
// so you can just do require('sample-view')
var core = require('bolt/core');
var View = require('bolt/view').View;

exports.SampleView = core.createClass({
  name: 'SampleView',
  extend: View,
  declare: function(options) {
    return {
      content: "hello world!"
    };
  }
});