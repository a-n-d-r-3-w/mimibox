const plaintext = 'hello, world';
const encryptedData = sjcl.encrypt('mypassword', plaintext);
console.log('encryptedData:', encryptedData);
const recoveredData = sjcl.decrypt('mypassword', encryptedData);
console.log('recoveredData:', recoveredData);

const mimibox = {
  entries: [
    { name: 'Facebook', username: 'lookatme137', password: 'fb-password' },
    { name: 'Amazon', username: 'shopper923', password: 'amazon-password' }
  ],
};