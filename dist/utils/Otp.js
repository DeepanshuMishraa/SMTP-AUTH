"use strict";
// generate the otp and send it to the email
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
function SendOtp(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email }) {
        // generate a 4digit otp
        const otp = Math.floor(Math.random() * 9000 + 1000);
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const info = yield transporter.sendMail({
            from: "deepanshu@mail.com",
            to: email,
            subject: "OTP for Registering",
            text: otp.toString(),
        });
        if (info.response) {
            return {
                message: "Message Sent Succesfully",
                status: 200
            };
        }
        else {
            console.error();
        }
    });
}
