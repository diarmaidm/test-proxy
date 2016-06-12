process.env.NODE_ENV = 'test';
process.env.TARGET = 'http://localhost:3002/';
global.expect = require('chai').expect;