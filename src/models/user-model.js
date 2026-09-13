import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "name must be at least 3 characters"],
      maxLength: [20, "name cannot exceed 20 characters"],
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      minLength: [5, "username must be at least 5 characters"],
      maxLength: [10, "username cannot exceed 10 characters"],
      trim: true,
      lowercase: true,
      unique: [true, "username already exists"]
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "account already exists"],
      maxLength: [254, "email is too long"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    profilePic: {
      url: {
        type: String,
        required: [true, "profile pic url is required"],
        default: 'none'
      },
      fileId: {
        type: String,
        required: [true, "profile pic file id is required"],
        default: 'none'
      },
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: [2, 'role must be at least 2 characters'],
      maxLength: [40, "role can't exceed 500 characters"]
    },
    experience: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: ['beginner', 'intermediate', 'advanced', 'expert'],
        message: "experience must be beginner or intermediate or advanced or expert",
      },
    },
    connections: {
      type: Number,
      defautl: 0,
      min: [0, "connections can't be less than 0"]
    },
    age: {
      type: Number,
      min: [18, "age must be between 18-60"],
      max: [60, "age must be between 18-60"],
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message: "gender must be male or female or others",
      },
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: [50, 'description must be at least 50 characters'],
      maxLength: [500, "description can't exceed 500 characters"]
    },
    tags: {
      type: [
        {
          type: String,
          maxLength: [30, "tag name can't exceed 30 characters"],
          minLength: [1, "tag name must be at least 1 character"],
          trim: true,
          lowercase: true,
        },
      ],
      validate: {
        validator: function(value) {
          return value.length < 15;
        },
        message: "maximum 15 tags are allowed",
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
