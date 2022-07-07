const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'not_bacon';

console.log('hashit loaded');

function doHash(){
  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      console.log('hash for ' + myPlaintextPassword + ' is: ' + hash);
  });
}

exports = doHash;