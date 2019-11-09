const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keypressHandler = require('./keypressHandler');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = require('./messageQueue');
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);

  res.writeHead(200, headers);

  if (req.method === 'OPTIONS') {
    res.end();
    next();
  }

  if (req.method === 'POST') {
    console.log('pda outside', req._postData);
    fs.writeFile(module.exports.backgroundImageFile, req._postData, (err) => {
      if (err) throw err;
      console.log('pda', req._postData);

      res.writeHead(201, headers);
      res.end();
      next();
    });

  }

  if (req.method === 'GET') {

    if (fs.existsSync(req.url)) {

      res.writeHead(200, headers);

    } else {

      res.writeHead(404, headers);
    }

    var direction = messageQueue.dequeue();
    if (direction) {
      res.writeHead(200, headers);
      res.write(direction);
    }

    res.end();
    next();
  }

  // res.end();
  // next(); // invoke next() at the end of a request to help with testing!
};
