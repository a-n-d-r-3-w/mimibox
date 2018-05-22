const plaintext = 'hello, world';
const encryptedData = sjcl.encrypt('mypassword', plaintext);
console.log('encryptedData:', encryptedData);
const recoveredData = sjcl.decrypt('mypassword', encryptedData);
console.log('recoveredData:', recoveredData);