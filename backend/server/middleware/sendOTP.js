import { config } from 'dotenv';
import twilio from "twilio";
config();

export function sendOTP(phoneNumber, otp) {

    const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
    client.messages
        .create({
            body: ` ${otp} This is your OTP for Farmhub password reset`,
            from: "+12708136198",
            to: `+91 ${phoneNumber}`,
        })
        .then((message) => {
            // console.log(message)
            // res.json(message)
        });
}