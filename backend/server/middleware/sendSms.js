var fast2sms = require('fast2sms');
require('dotenv').config();

const sendSms = async (options)=>{
    

    const SmsOptions = {
        authorization:YIxKDanFmyfoiUwSqQz5sVhpONuZ3W7jXG4rHRcT08BbA6JdMPRpVLfquatjSDFogQcNzYW54mdXIrlw,
        message: options.message,
        number: options.phoneNumber,
    }
    

    const response = await fast2sms.sendMessage(SmsOptions);
    res.send(response);
}

module.exports = sendSms;