import nodemailer from 'nodemailer';
import Verification from '@/models/verification';
import PasswordReset from '@/models/passwordReset';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { TimeSpan, createDate } from 'oslo';
import dbConnect from '@/lib/mongodb/mongoose';

export async function sendEmail({ email, emailType, userId }: any) {
  try {
    await dbConnect();

    //clear out any existing codes for the current user
    const deletedCodes = await Verification.deleteMany({
      user_id: userId,
    });
    if (deletedCodes.deletedCount > 0) {
      console.log(`Deleted ${deletedCodes.deletedCount} verification codes`);
    }

    const code = generateRandomString(6, alphabet('0-9'));

    if (emailType === 'VERIFY') {
      //create a new verification record
      await Verification.create({
        user_id: userId,
        email,
        code,
        expires_at: createDate(new TimeSpan(15, 'm')), // 15 minutes
      });
    } else if (emailType === 'RESET') {
      //create new password reset document
      PasswordReset.create({
        user_id: userId,
        email,
        code,
        expires_at: createDate(new TimeSpan(15, 'm')), // 15 minutes
      });
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      greetingTimeout: 1000 * 50,
    });

    let mailOptions;
    if (emailType === 'VERIFY') {
      mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Email Verification',
        html: `<p>Your verification code is: <b>${code} </b></p>`,
      };
    } else if (emailType === 'RESET') {
      mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Your verification code is: <b>${code} </b></p>`,
      };
    }
    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    console.log(error);

    return error;
  }
}
