import { config } from 'dotenv';
import twilio from "twilio";

config();

// Function to send OTP via Twilio
export function sendOTP(phoneNumber, otp) {

    // Create a Twilio client using the account SID and auth token from the environment variables
    const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

    // Send the OTP message
    client.messages
        .create({
            body: ` ${otp} This is your OTP for Farmhub password reset`,
            from: "+12708136198", // Twilio phone number
            to: `+91 ${phoneNumber}`, // Recipient's phone number
        })
        .then((message) => {
            // Handle the response if needed
            // console.log(message)
            // res.json(message)
        });
}