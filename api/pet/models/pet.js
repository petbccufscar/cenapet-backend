'use strict';

require('dotenv').config();
const axios = require('axios');

module.exports = {
    lifecycles: {
        async beforeCreate(data) {

            const secret_key = process.env.SECRET_KEY;
            const token = data.token;

            const google_response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`)

            if (!google_response.data.success) {
                throw new Error('Recaptcha failed! (' + google_response.data['error-codes'] + ')');
            }
        },
    },
};
