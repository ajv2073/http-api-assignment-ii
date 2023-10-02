const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const jsonHandler = require('./jsonResponse.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//Head requests
const handleHead = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsersMeta(request, response);
      } 
    else if (parsedUrl.pathname === '/notReal') {
        jsonHandler.notRealMeta(request, response);
      } 
    else {
        jsonHandler.notRealMeta(request, response);
      }
};

//Post requests
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {
      const res = response;
      const body = [];
  
      request.on('error', (err) => {
        console.dir(err);
        res.statusCode = 400;
        res.end();
      });
  
      request.on('data', (chunk) => {
        body.push(chunk);
      });
  
      request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
  
        const bodyParams = query.parse(bodyString);
  
        jsonHandler.addUser(request, res, bodyParams);
      });
    }
};

//Get requests
const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/style.css') {
      htmlHandler.getCSS(request, response);
    } 
    else if (parsedUrl.pathname === '/getUsers') {
      jsonHandler.getUsers(request, response);
    } 
    else if (parsedUrl.pathname === '/notReal') {
      jsonHandler.notReal(request, response);
    } 
    else {
      htmlHandler.getIndex(request, response);
    }
};

//Request is received
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    if (request.method === 'POST') {
      handlePost(request, response, parsedUrl);
    } 
    else if (request.method === 'HEAD') {
      handleHead(request, response, parsedUrl);
    } 
    else {
      handleGet(request, response, parsedUrl);
    }
  };

  http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
  });