const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
}

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password } = req.body || {};

    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    const userExits = await User.findOne({email});
    if (userExits) {
        res.status(400);
        throw new Error("Email is already in use or exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });
    const token = generateToken(user._id);
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    })

    if(user) {
        const { _id, name, email, photo, role } = user;
        res.status(201).json({ _id, name, email, photo, role });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if(!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("User not found, Please sign up");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    const token = generateToken(user._id);
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true,
    });

    if(user && passwordIsCorrect) {
        const { _id, name, email, photo, role } = user;
        res.status(201).json({ _id, name, email, photo, role});
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
})

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if(verified) {
        return res.json(true);
    }
    return res.json(false);
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
    });
    res.status(200).json({ message: "Successfully logged out." });
});

const test = asyncHandler(async (req, res) => {
    res.send("");
})

module.exports = {
    registerUser,
    loginUser,
    loginStatus,
    logoutUser,
    test,
};