const axios = require("axios");

const getGoogleUser = async (token) => {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;  
    return axios.get(url);
}

module.exports = {
    getGoogleUser
}