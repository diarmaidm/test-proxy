var express = require('express');
var proxyMiddleware = require('http-proxy-middleware');

var app = express();

app.disable('x-powered-by');

app.use(function(req, res, next) {
  req.headers["header1"] = req.headers["header3"] || 'abc';
  req.headers["header2"] = req.headers["header4"] || 'def';

  // console.log('\n 111 ..... ..... ..... ..... ..... ..... in app.js -> req.headers\n', req.headers);

  // res.setHeader('X-Frame-Options', directive?)
  res.setHeader('X-Download-Options', 'noopen')
  res.setHeader('Surrogate-Control', 'no-store')
  // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Cache-Control', 'no-store, no-cache')
  // res.header('Cache-Control', 'no-store' );
  res.setHeader('Pragma', 'no-cache')
  // res.header('Pragma', 'no-cache' );
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-DNS-Prefetch-Control', 'off')
  res.setHeader('Expires', '0')
  next();
});

// make target configurable
  // target: 'http://localhost:3002/', // target host
  // target: 'http://soap-add.cfapps.io/', // target host
  // target: process.env.TARGET || 'http://localhost:3002/', // target host
  // target: process.env.TARGET, // target host
var context = '/';
console.log('\n ..... ..... ..... ..... ..... ..... process.env.TARGET:', process.env.TARGET)
var options = {
  target: process.env.TARGET || 'http://soap-add.cfapps.io/', // target host
  changeOrigin: true,               // needed for virtual hosted sites
  logLevel: 'debug',
  // logLevel: 'info',
  // logLevel: 'silent',
  onError: onError
};
var proxy = proxyMiddleware(context, options);

function onError(err, req, res) {
  // dumping out full error. Should not do this :)
  console.log('\n ..... ..... ..... ..... ..... ..... in app.js -> proxy error:\n', err);
  // How do we want to handle proxy problem?
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. \nAnd we are reporting a custom error message.');
}

app.use(proxy);

app.use(function(req, res, next) {
  console.log('\n 135 ..... ..... ..... ..... ..... ..... in app.js -> before end. This shouldnt be hit\n');
  next();
});

/* process.env.VCAP_APP_PORT is undefined on run.pivotal.io and process.env.PORT is 8080 */
console.log('\n ..... ..... ..... ..... ..... ..... process.env.PORT:', process.env.PORT)
console.log('\n ..... ..... ..... ..... ..... ..... process.env.VCAP_APP_PORT:', process.env.VCAP_APP_PORT)
// Which of these is better???
app.listen(process.env.PORT || 3000);
// var port=process.env.VCAP_APP_PORT || 3000;
// app.listen(3000);

// for some reason this exports occasionally caused pcf to crash the app??? Investigate.
// I think it may only be for testing? verify.
// module.exports = app;
console.log('\n ..... ..... ..... ..... ..... ..... process.env.NODE_ENV:', process.env.NODE_ENV)
// if(process.env.NODE_ENV === 'test') {
module.exports = app;
// }
