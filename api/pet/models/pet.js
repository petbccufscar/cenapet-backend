'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

require('dotenv').config();
const axios = require('axios');

module.exports = {
    lifecycles: {
        async beforeCreate(data) {

            const secret_key = process.env.SECRET_KEY;
            const token = data.token;

            const gresponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`)

            if (!gresponse.data.success) {
                throw new Error('Recaptcha failed! (' + gresponse.data['error-codes'] + ')');
            }
        },
    },
};
