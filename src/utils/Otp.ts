// generate the otp and send it to the email

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function SendOtp({ email }: { email: string }) {
  // generate a 4digit otp
  const otp = Math.floor(Math.random() * 9000 + 1000);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: "deepanshu@mail.com",
    to: email,
    subject: "OTP for Registering",
    text: otp.toString(),
  });

  if(info.response){
    return {
        message:"Message Sent Succesfully",
        status:200
    }
  }else{
    console.error();
  }

}
