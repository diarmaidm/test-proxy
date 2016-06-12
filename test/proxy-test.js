var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var app = require('../app');
var http = require('http');

// var something = 'dummy';

describe('Proxy application', function () {
  var server;

  before(function(done) {
    // use a variable to test header set correctly?
    server = http.createServer(function(request, response) {
      var headers = request.headers;
      // var method = request.method;
      // var url = request.url;
      // var body = [];
      request.on('error', function(err) {
        console.error(err);
      }).on('request', function(chunk) {
        // body.push(chunk);
      }).on('data', function(chunk) {
        // body.push(chunk);
      }).on('end', function() {
        // body = Buffer.concat(body).toString();
        expect(request.headers["header1"]).to.exist;
        expect(request.headers['header2']).to.exist;
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.

        // console.log('\n 222 ..... ..... ..... server on end: headers:\n', headers);

        // Add the request headers to the response header so we can test against.
        response.setHeader('header1', request.headers['header1']);
        response.setHeader('header2', request.headers['header2']);
        // console.log('\n 333 ..... ..... ..... server on end: response.headers:\n', response.headers);
        // console.log('\n 333 ..... ..... ..... server on end: response:\n', response);
        response.end();
      });
    });
    server.listen(3002); // Activates this server, listening on port .
    done();
  });

  after(function(done) {
    server.close();
    server = null;
    done();
  });

  it('returns a 200 for a GET on root path and sets headers', function (done) {
    // console.log('/******************** Start of test 1 ********************/');
    request(app)
      .get('/')
      .set({"header3":"dummy-header1","header4":"header4"})
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).equals(200);
        expect(res.headers).to.exist;
        // console.log('\n 999 ..... res.headers:\n', res.headers);
        expect(res.headers['header1']).to.exist;
        expect(res.headers['header1']).to.be.equal('dummy-header1');
        // console.log('res.headers', res.headers);
        // ['header1']
        done();
      });
  });

  it('returns a 200 for a GET on staff list and sets headers', function (done) {
    // console.log('/******************** Start of test 2 ********************/');
    request(app)
      .get('/staff')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).equals(200);
        expect(res.headers['header1']).to.be.equal('abc');
        done();
      });
  });

});

describe('The uri we are proxying to is unavailable', function() {
  it('gives a friendly error', function (done) {
    // console.log('/******************** Start of test 3 ********************/');
    request(app)
      .get('/')
      // .set({"header3":"blah-header1","header4":"Blahheader4"})
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).equals(500);
        expect(res.headers['header1']).to.be.undefined;
        expect(res.headers['header2']).to.not.exist;
        expect(res.text).to.be.equal('Something went wrong. \nAnd we are reporting a custom error message.');
        done();
      });
  });
});
