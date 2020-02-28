const sha1 = require('crypto-js/hmac-sha1');
const base64 = require('crypto-js/enc-base64');

const username = `${ Math.floor(Date.now() / 1000) + 3 * 60 * 60 }:${ 274523.2259 }`;
// const username = '1582870287:unauth-web-client@10.200.112.165.xip.io';

const hash = sha1(username, 'Yealink1105');
const password = base64.stringify(hash);

console.log(username, password);
