'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHashAndSalt: {
      type: String,
      required: true
    },
    picture: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', schema);

module.exports = User;
