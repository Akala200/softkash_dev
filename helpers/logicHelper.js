const bcrypt = require('bcryptjs');
const generateUniqueId = require('generate-unique-id');

exports.makeHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    } catch (error) {
        console.log(error);
    }
  
}


exports.makeToken = async () => {
    try {
        const token = await generateUniqueId({
            length: 6,
            useLetters: false
          });
        return token;
    } catch (error) {
        console.log(error);
    }
}