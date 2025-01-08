const CryptoJS = require('crypto-js');

// function to encrypt data
export function  encryptData (SECRET_KEY, data){
    if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined");
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// function to decrypt data
export function decryptData(SECRET_KEY, encryptedData){
    if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined");
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
};