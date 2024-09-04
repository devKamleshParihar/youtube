import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: 'sahilparihar16102002@gmail.com',
                pass: 'rzhj ffjp xwvg xtun',
            },
        });
    }

    async sendOtp(email: string, otp: string) {
        const mailOptions = {
            from: '"Sahil" <sahilparihar16102002@gmail.com>', // Sender address
            to: email, // Recipient's email
            subject: 'Your OTP Code', // Subject line
            text: `Your OTP code is: ${otp}`, // Plain text body
        }
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('OTP email sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending OTP email:', error);
        }
    }


}

