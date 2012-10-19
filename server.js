var config = require('./config'); // exporting to global scope
var http  = require('http');
var url   = require("url");

var log   = require('./utils/lib/log');
var comm  = require('./utils/lib/comm');
log.level = log.INFO;
log.level = log.DEBUG;

function str_from_req(req)
{
  return "req: method="+req.method+" httpVersion="+req.httpVersion+" url="
    +req.url+"\nheaders="+JSON.stringify(req.headers, null, 2)
    +"\nbody="+req.body;
}

// handles all external requests
function req_handler(req, res)
{
  var parse = url.parse(req.url);
  var pathname = parse.pathname;

  // if no path specified, default to index.shtml
  if (pathname.length <= 1) {
    pathname = '/index.html';
  }
  pathname =  config.pub_root+pathname;
  log.debug('request: '+str_from_req(req));

  var split = pathname.split('/');
  var command = split[1];
  log.debug('pathname is '+pathname+' root is ' + command);

  // serving up a regular file
  if('ajax' != command){
    log.info('sending ' + pathname);
    var options = {
      log : ''
    };
    comm.sendFile(req, res, pathname, options);
    return;
  } else {
    log.info('unkown command pathname is '+pathname+' root is ' + command);
  }
}


// ========================================
// Start the servers

http.createServer(
  req_handler
).listen(process.env.PORT);
log.info('HTTP Server running :' + process.env.PORT);