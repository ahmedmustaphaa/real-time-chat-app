import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const authData = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    // ✅ هنا بنجيب المستخدم الحقيقي من الداتا بيز
   const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // ✅ كده هيروح sendMessage يلاقي user._id

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
