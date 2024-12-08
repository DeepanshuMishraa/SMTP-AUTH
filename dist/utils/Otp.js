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
exports.SendOtp = SendOtp;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Store generated OTPs temporarily
const otpStore = {};
function SendOtp(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate a 4-digit OTP
            const otp = Math.floor(Math.random() * 9000 + 1000).toString();
            // Create transporter
            const transporter = nodemailer_1.default.createTransport({
                service: "Gmail",
                auth: {
                    user: "workrelatedmail2005@gmail.com",
                    pass: "sdgc lipq zltc rqum"
                },
            });
            // Prepare mail options
            const mailOptions = {
                from: "workrelatedmail2005@gmail.com",
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP code is ${otp}`
            };
            // Store OTP with expiration (10 minutes)
            otpStore[email] = {
                otp,
                expiresAt: Date.now() + 10 * 60 * 1000
            };
            // Send email
            yield transporter.sendMail(mailOptions);
            return true;
        }
        catch (error) {
            console.error("Error sending OTP:", error);
            return false;
        }
    });
}
// Method to verify OTP
SendOtp.verifyOtp = function (email, userOtp) {
    const storedOtp = otpStore[email];
    // Check if OTP exists and is not expired
    if (!storedOtp || storedOtp.otp !== userOtp || Date.now() > storedOtp.expiresAt) {
        return false;
    }
    // Remove OTP after successful verification
    delete otpStore[email];
    return true;
};
exports.default = SendOtp;
