const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

async function registerController(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return next(new AppError("User already exists", 409));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    if (!userExists) {
      return next(new AppError("User doesn't exist", 401));
    }

    const matchPassword = await bcrypt.compare(password, userExists.password);

    if (!matchPassword) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: userExists._id,
        name: userExists.name,
        email: userExists.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logoutController(req, res, next) {
  try {
    res.clearCookie("jwt_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
};
