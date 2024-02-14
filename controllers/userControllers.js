import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs/promises";
import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
const { SECRET_KEY } = process.env;

export const singupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "User already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });
    const payload = {
      id: newUser._id,
    };

    const token = jwt.sign(payload, SECRET_KEY);
    await User.findByIdAndUpdate(newUser._id, { token });
    res.status(201).json({
      token,
      user: {
        name,
        email,
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const singinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY);
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token,
      user: {
        name: user.name,
        email,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = (req, res) => {
  const { email, name, avatar: avatarURL } = req.user;
  res.status(200).json({ email, name, avatarURL });
};

export const logoutUser = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};
