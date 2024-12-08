import express, { Request } from "express";
import prisma from "./utils/db";
import bcrypt from "bcryptjs";
import { SendOtp } from "./utils/Otp";

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !name || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
       return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });
       return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpResult = await SendOtp(email);
    if (!otpResult) {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
       return;
    }

    await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        isVerified: false,
      },
    });

    res.status(201).json({
      success: true,
      message: "OTP has been sent to your registered email, please verify",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
   
    const isOtpValid = await SendOtp.verifyOtp(email, otp);

    if (!isOtpValid) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
      return;
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

export default app;
