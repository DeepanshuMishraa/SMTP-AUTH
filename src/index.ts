import express from "express";
import prisma from "./utils/db";
import bcrypt from "bcryptjs";
import { SendOtp } from "./utils/Otp";

// User will first register and an email containing the OTP will be sent to the user if the otp on the verify route is correct then the user will be logged in

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !name || !password) {
      res.json({
        message: "All fields are required",
      });
      return;
    }

    // check if user exists

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      res.json({
        message: "User already exists",
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await SendOtp(email);

    await prisma.user.create({
      data: {
        email: email,
        name: email,
        password: hashedPassword,
      },
    });

    res.json({
      message: "OTP has been sent to your registered Email , please verify",
    });
  } catch (err) {
    res.json({
      message: `Error : ${err}`,
    });
    return;
  }
});

app.listen(3000, () => {
  console.log("App is running");
});
