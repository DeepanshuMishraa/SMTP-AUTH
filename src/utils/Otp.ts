import nodemailer from "nodemailer";
import { EMAIL, password } from "../config";

const otpStore: { [key: string]: { otp: string, expiresAt: number } } = {};

export async function SendOtp(email: string): Promise<boolean> {
  try {
    // Generate a 4-digit OTP
    const otp = Math.floor(Math.random() * 9000 + 1000).toString();


    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL,
        pass: password
      },
    });


    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`
    };


    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}

SendOtp.verifyOtp = function(email: string, userOtp: string): boolean {
  const storedOtp = otpStore[email];


  if (!storedOtp || storedOtp.otp !== userOtp || Date.now() > storedOtp.expiresAt) {
    return false;
  }

  delete otpStore[email];
  return true;
};

export default SendOtp;
