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



  if (req.method === 'GET'){
    fs.readFile(req.url, (err) => {
      console.log(err);
      if (err) {
        res.writeHead(404, headers);
      } else {
        res.writeHead(200, headers);
        
      }
      next();
    });

    var direction = messageQueue.dequeue();
    if (direction) {
      res.writeHead(200, headers);
      res.write(direction);
      next();
    }
  }

  if (req.method === 'POST'){

  }




  res.end();
  // next(); // invoke next() at the end of a request to help with testing!
};
