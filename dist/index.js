"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./utils/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Otp_1 = require("./utils/Otp");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!email || !name || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const user = yield db_1.default.user.findUnique({
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
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const otpResult = yield (0, Otp_1.SendOtp)(email);
        if (!otpResult) {
            res.status(500).json({
                success: false,
                message: "Failed to send OTP",
            });
            return;
        }
        yield db_1.default.user.create({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
}));
app.post("/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const isOtpValid = yield Otp_1.SendOtp.verifyOtp(email, otp);
        if (!isOtpValid) {
            res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
            return;
        }
        // Mark user as verified
        yield db_1.default.user.update({
            where: { email },
            data: { isVerified: true },
        });
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Verification failed",
        });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
exports.default = app;
