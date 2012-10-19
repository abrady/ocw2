var fs = require('fs');
var path = require('path');

function sendFileNotFound(res, filename, err) {
  console.log('fnf: ' + filename);
   (typeof Log !== 'undefined') && Log.http('404 - ' + filename);
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('404 Not Found: ' + filename + ' (' + err + ')\n');
  res.end();
}

function fullFileName(filename) {
  return process.cwd() + (filename[0] == '/' ? '' : '/') + filename;
}

/**
 * Send a file with an http header
 */
function sendFile(req, res, filename, options) {
  options = options || {};
  var fullname = fullFileName(filename);
  fs.readFile(fullname, 'binary', function(err, file) {
    if (err) {
      if (options.cb) {
          options.cb(res, filename);
      } else {
        sendFileNotFound(res, filename, err);
      }
    } else {
      var extension = path.extname(filename);
      var header = {};
      switch (extension) {
        case '.js':
          header['Content-Type'] = 'text/javascript';
          header['Cache-Control'] = 'max-age=31536000'; // 1 year
          break;
        case '.css':
          header['Content-Type'] = 'text/css';
          header['Cache-Control'] = 'max-age=31536000';
          break;
        case '.manifest':
          header['Content-Type'] = 'text/cache-manifest';
          break;
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
          header['Cache-Control'] = 'max-age=31536000';
          break;
      }
      res.writeHead(200, header);
      res.write(file, 'binary');
      res.end();
    }
  });
}

function toClient(user, cmd) {
  user.commands.push(cmd);
}

exports.sendFileNotFound = sendFileNotFound;
exports.sendFile = sendFile;
exports.toClient = toClient;