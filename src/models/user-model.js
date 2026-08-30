import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: ["true", "name is required"],
      minLength: [3, "name must be at least 3 characters"],
      maxLength: [30, "name cannot exceed 30 characters"],
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: ["true", "name is required"],
      minLength: [5, "username must be at least 5 characters"],
      maxLength: [10, "username cannot exceed 10 characters"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: ["true", "email is required"],
      unique: ["true", "account already exists"],
      maxLength: [254, "email is too long"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: ["true", "password is required"],
      select: false,
    },
    age: {
      type: Number,
      required: ["true", "age is required"],
      min: [18, "age must be between 18-60"],
      max: [60, "age must be between 18-60"],
    },
    gender: {
      type: String,
      required: ["true", "gender is required"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message: "gender must be male or female or others",
      },
    },
    skills: {
      type: [
        {
          type: String,
          maxLength: [30, "skill name cann't exceed 30 charactes"],
          minLength: [1, "skill name must be at least 1 character"],
          trim: true,
          lowercase: true,
        },
      ],
      validate: {
        validator: function(value) {
          return value.length < 10;
        },
        message: "maximum 10 skills are allowed",
      },
    },
  },
  {
    timestamps: true,
  },
);

// hash the password before saving in DB
userSchema.pre("save", async function() {
  // if password is not modified then no need for hashing
  if (!this.isModified("password")) return;

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

// methods
userSchema.methods.verifyPassword = async function(passwordByUser) {
  const isPasswordValid = await bcrypt.compare(passwordByUser, this.password);
  return isPasswordValid;
};

userSchema.methods.generateJWT = function() {
  const token = jwt.sign({ id: this._id }, "my_secret_key_comes_here", {
    expiresIn: "1d",
  });

  return token
};


export const User = mongoose.model("User", userSchema);
