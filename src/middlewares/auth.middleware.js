const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const AppError = require("../utils/AppError");

async function tokenExists(req, res, next) {
  try {
    const token = req.cookies.jwt_token;

    if (!token) {
      return next(new AppError("No token provided. Please login.", 401));
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next(new AppError("Invalid or expired token", 401));
    }

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = tokenExists;
