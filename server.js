var config = require('./config'); // exporting to global scope
var fs    = require('fs');
var http  = require('http');
var https = require('https');
var log   = require('util/log');
var sys   = require("sys");
var url   = require("url");
log.level = log.INFO;
log.level = log.DEBUG;

function str_from_req(req)
{
  return "req: method="+req.method+" httpVersion="+req.httpVersion+" url="\
    +req.url+"\nheaders="+JSON.stringify(req.headers, null, 2)\
    +"\nbody="+req.body;
}

// handles all external requests
function req_handler(req, res)
{
  var parse = url.parse(req.url);
  var pathname = parse.pathname;
  var params = params_from_url(req.url);

  // if no path specified, default to index.shtml
  if (pathname.length <= 1) {
    pathname = '/index.shtml';
  }
  pathname =  config.pub_root+pathname;
  log.debug('request: 'str_from_req(req));
  
  var split = pathname.split('/');
  var command = split[1];
  log.debug('pathname is '+pathname+' root is ' + command);

  // serving up a regular file
  if('ajax' != command)){
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

log.info("Running app " + config.app_name + " id " + config.app_id);
log.info("connecting to graph url " + g_graph_url);
http.createServer(
  req_handler
).listen(process.env.PORT);
log.info('HTTP Server running :' + process.env.PORT);

if (config.https_port) {
  https.createServer(options, req_handler).listen(config.https_port);
  log.info('HTTPS Server running:' + (config.https_port));
}