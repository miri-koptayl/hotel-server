import { userModel } from "../models/user.js";
import { jwtt } from "../Utils/generateToken.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // טעינת משתני סביבה

export const getAllUsers = async (req, res) => {
    try {
        let data = await userModel.find().select('-password');
        res.json(data);
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error cannot get all", message: err.message });
    }
};

export const addUserSignUp = async (req, res) => {
    const { phone, email, username, password } = req.body;
    if (!phone || !email || !username || !password)
        return res.status(400).json({ title: "missing data", message: "All fields are required" });

    try {
        let existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ title: "User already exists", message: "Username or email already taken" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new userModel({ ...req.body, password: hashedPassword });
        let data = await newUser.save();
        console.log(data)
        console.log(process.env.SECRET_KEY)
        data.token = jwtt(data);
        await data.save();
        res.json(data);
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error cannot add", message: err.message });
    }
};

export const getUserByUserNamePasswordLogin = async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ title: "missing username or password", message: "Both fields are required" });
        
        let user = await userModel.findOne({ username });
        if (!user)
            return res.status(404).json({ title: "cannot login", message: "User not found" });
        
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ title: "cannot login", message: "Invalid credentials" });

        user.token = jwtt(user);
        await user.save();
        res.json(user);
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error cannot login", message: err.message });
    }
};

export const updateUserPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!newPassword)
        return res.status(400).json({ title: "missing data", message: "New password is required" });
    
    try {
        let user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ title: "user not found", message: "No user with this email" });
        
        user.password = await bcrypt.hash(newPassword, 10);
        let updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error", message: err.message });
    }
};
