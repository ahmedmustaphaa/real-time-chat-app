import { User } from "../models/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { generateToken } from "../config/utils.js";

import cloudinary from "../config/cloudinary.js";

export const signUp=async (req,res)=>{

    const {email,name,bio,password}=req.body;
               try{
                
    if(!name  || !password || !bio || !email){
        return res.json({success:false ,message:" missing data "})
    }

    const user =await User.findOne({email});

    if (user) return res.json({success:false , message:"email allready exist"});

    const newpassword=await bcrypt.hash(password ,10);
   

    const newUser=await User.create({        name,email,password:newpassword,bio
    })

    const token=generateToken(newUser._id)
    newUser.save();

    res.json({success:true,token,userData:newUser,message:'account created successfully'})
               }catch (error){

                res.json({message:false ,message:error.message})
               }

}

// create user function for login;

export const userLogin=async (req,res)=>{

   


  
    try{
       const {email,password}=req.body;
          const user=await User.findOne({email});

          if(!user){
            res.send({success:false ,messgae:"not fpund"})
          }

   const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(user._id);
     res.json({
      success: true,
      message: "User logged in successfully",
      token,
      user
    })

    }catch(error){
             res.json({message:false ,message:error.message})
    }

}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // ✅ هنا التعديل
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const { profilePic, name, bio } = req.body;
const userId = req.user._id; // ✅ الصح

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let updatedFields = {
      name,
      bio,
    };

    // لو فيه صورة، نرفعها على cloudinary
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: 'user-profiles',
      });

      updatedFields.profilePic = upload.secure_url;
    }

    // تحديث المستخدم
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "تم تحديث الحساب بنجاح",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 

     
