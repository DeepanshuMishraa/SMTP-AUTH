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
// User will first register and an email containing the OTP will be sent to the user if the otp on the verify route is correct then the user will be logged in
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!email || !name || !password) {
            res.json({
                message: "All fields are required",
            });
            return;
        }
        // check if user exists
        const user = yield db_1.default.user.findUnique({
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
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield (0, Otp_1.SendOtp)(email);
        yield db_1.default.user.create({
            data: {
                email: email,
                name: email,
                password: hashedPassword,
            },
        });
        res.json({
            message: "OTP has been sent to your registered Email , please verify",
        });
    }
    catch (err) {
        res.json({
            message: `Error : ${err}`,
        });
        return;
    }
}));
app.listen(3000, () => {
    console.log("App is running");
});
