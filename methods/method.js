const nodemailer = require('nodemailer');

function sendMail(mailOptions) {
   return new Promise(function (resolve, reject) {
      var transporter = nodemailer.createTransport({
         service: 'gmail',

         auth: {
            user: 'callbackit67@gmail.com',
            pass: 'callback@123',
         },
         Goto: 'https://callbackit67.google.com/lesssecureapps',
         Enable: 'Allow less secure apps: ON',
         /*tls: {
                rejectUnauthorized : false
            }*/
      });

      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            //console.log(error)
            return reject(error);
         }

         return resolve(info);
      });
   });
}

//var ciphertext = CryptoJS.AES.encrypt(req.body.useremail, 'secret key 123');
let cipher = (salt) => {
   let textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
   let byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
   let applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

   return (text) =>
      text
         .split('')
         .map(textToChars)
         .map(applySaltToChar)
         .map(byteHex)
         .join('');
};

let decipher = (salt) => {
   let textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
   let saltChars = textToChars(salt);
   let applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);
   return (encoded) =>
      encoded
         .match(/.{1,2}/g)
         .map((hex) => parseInt(hex, 16))
         .map(applySaltToChar)
         .map((charCode) => String.fromCharCode(charCode))
         .join('');
};

module.exports.sendMail = sendMail;
module.exports.cipher = cipher;
module.exports.decipher = decipher;
