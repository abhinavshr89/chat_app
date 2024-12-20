import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if(!fullname || !email || !password){
        return res.status(400).json({message:"Please fill in all fields"});
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic || ""
      });
    } else {
      res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async(req, res) => {
  const {email,password} = req.body;
  try{
    if(!email || !password){
      return res.status(400).json({message:"Please fill in all fields"});
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"Invalid credentials"});

    } 
    const isMatch = await bcrypt.compare(password, user.password); 
    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"});
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic || ""
    });

  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try{
    res.clearCookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out"});
  }
  catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
   try{
    const{profilePic} = req.body;
    const userId = req.user ? req.user._id : null;
    if(!userId){
      return res.status(401).json({message:"Unauthorized"});
    }
    if(!profilePic){
      return res.status(400).json({message:"Please provide an image"});
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true});
    if(updatedUser){
      res.status(200).json({
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic
      });
    }else{
      res.status(400).json({message:"Failed to update profile"});
    }
   }catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
   }
};


export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};