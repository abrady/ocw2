// this is a "directory module" that can be referenced by its directory name
// so you can just do require('sample-view')
var core = require('bolt/core');
var View = require('bolt/view').View;
var Button  = require('bolt_touch/views/button').Button;

exports.SampleView = core.createClass({
  name: 'SampleView',
  extend: View,
  declare: function(options) {
    return {
      content: "hello world! 3"
    };
  }
});

var ButtonExample = core.createClass({
  extend: View,

  properties: {
    secondButtonValue: null // defines setSecondValue()
  },

  construct: function(options) {
    this.firstButtonValue = "First Button";
    View.call(this, options);
    this.setSecondButtonValue("Second Button");
  },

  declare: function(options) {
    return{
      childViews: [
        {
          view: Button,
          value: 'Example Button 1',
          ref: 'buttonOne'
        },
        {
          view: Button,
          value: 'Example Button 2',
          ref: 'buttonTwo'
        }
      ]
    }
  },

  ready: function() {
    this.buttonone = this.refs.buttonone;
    this.buttontwo = this.findRef('buttontwo');
  },

  onButtonOneClick: function() {
    this.buttonone.setValue(this.firstButtonValue);
  },

  onButtonTwoClick: function() {
    this.buttontwo.setValue(this.getSecondButtonValue());
  }
})

var builder = require('bolt/builder');

var myButton = builder.build({
    // Define the type of view to build
    view: Button,
    // Set the initial value of the 'value' property
    value: 'Click Me',
    // Define an action to perform when this button is clicked or tapped.
    action: function(button, event) {
      alert('You clicked the button with the value ' + button.getValue());
    }
});

// Define a new view called MyPaneLayout
var MyPaneLayout = core.createClass({
  name: 'MyPaneLayout',
  extend: View,
  boxOrientation: 'vertical',

  declare: function() {
    // Call the setLayout function, which uses the builder to create
    // it's sub views
    return {
      childViews: [
        {
          className: 'header',
          content: 'Choose A Pane'
        },
        {
          // Define a horizontally laid out container with two buttons
          boxOrientation: 'horizontal',
          childViews: [
            // Create two buttons.  Note how the 'action' is bound to
            // 'onSelectPane'.  Because the 'MyPaneLayout' view is creating
            // the Button, a listener can be added to the Button as a
            // string telling it the name of the funtion on the Buttons
            // owner to call
            {
              view: Button,
              value: 'Pane 1',
              action: 'onSelectPane'
            },
            {
              view: Button,
              value: 'Pane 2',
              action: 'onSelectPane'
            }
          ]
        },
        // Define the two panes which will be shown/hidden when a button
        // is clicked.  Since no view type or tagName is provided, these
        // default to being simple DIV elements
        {
          ref: 'pane1',
          style: {
            height: '200px',
            backgroundColor: '#bbb'
          },
          content: 'This is Pane 1'
        },
        {
          ref: 'pane2',
          style: {
            height: '200px',
            backgroundColor: '#333',
            color: 'white',
            display: 'none'
          },
          content: 'This is Pane 2'
        }
      ]
    };
  },

  onSelectPane: function(button, event) {
    var value = button.getValue();

    // Check which button was clicked, and show/hide the
    // the panes
    if (value == 'Pane 1') {
      this.findRef('pane1').setStyle({display: ''});
      this.findRef('pane2').setStyle({display: 'none'});
    } else {
      this.findRef('pane1').setStyle({display: 'none'});
      this.findRef('pane2').setStyle({display: ''});
    }
  }
});

var context = {
  handleClick: function(event) {
    console.log('Button was clicked: ', event);
  }
};
myButton.addListener('click', 'handleClick', context);

var MyOnClickView = core.createClass({
  name : 'MyView',
  extend: View,
  declare: function() {
    return {
      content: "OnClick View"
    };
  },
  // Handler for the touch start event
  onClick: function(event) {
    alert('I was clicked!');
  }
});

var MyOwnerView = core.createClass({
  name : 'MyOwnerView',
  extend: View,
  declare: function() {
    return {
      childViews: [
        {
          content: "MyOwnerView Inner View",
          ref: "myInnerView"
        }
      ]
    };
  },
  // Handler for the touch start event
  onMyInnerViewMousedown: function(event) {
    this.refs.myInnerView.setContent("Mouse Down!!");
  },

  onMyInnerViewMouseup: function(event) {
    this.refs.myInnerView.setContent("no more clicky click :(");
  },

// Handler for the touch start event
  onMyInnerViewTouchstart: function(event) {
    this.refs.myInnerView.setContent("That tickles!!");
  },

  // Handler for the touch end event
  onMyInnerViewTouchend: function(event) {
    this.refs.myInnerView.setContent("Touch me again and I'll .....");
  }
});

exports.init = function() {
  // Instantiate a new instance of a MyPaneLayout view
  // and put it in the document body
  new MyPaneLayout().placeIn(document.body);
  // new exports.SampleView({}).placeIn(document.body);
  myButton.placeIn(document.body);
  new ButtonExample().placeIn(document.body);
  new MyOnClickView().placeIn(document.body);
  new MyOwnerView().placeIn(document.body);
}