import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import cloudinary from "../config/cloudinary.js";
import { userSocketMap } from "../server.js";
import { io } from "../server.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // هات كل المستخدمين ما عدا المستخدم الحالي
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password");

   const usersWithUnreadCounts = await Promise.all(
  users.map(async (user) => {
    const unreadCount = await Message.countDocuments({
      sender: user._id,
      receiver: currentUserId,
      seen: false,
    });

    const isOnline = Boolean(userSocketMap[user._id.toString()]); // ✅ تحديد حالة الاتصال

    return {
      ...user._doc,
      unreadCount,
      isOnline,
    };
  })
);


    res.json({ success: true, users: usersWithUnreadCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET all messages between current user and selected user
export const selectedUser = async (req, res) => {
  try {
    const currentUserId = req.user._id; // من التوكن
    const selectedUserId = req.params.id; // من رابط الـ API

    // هات كل الرسائل اللي فيها:
    // 1. المرسل = أنا && المستلم = المستخدم الآخر
    // 2. أو العكس
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: selectedUserId },
        { sender: selectedUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 }); // ترتيب حسب وقت الإرسال (قديم → جديد)

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const markMessageAsSeen = async (req, res) => {
  try {

       const {id}=req.params;

        await Message.findByIdAndUpdate(id,{seen:true});

        res.json({success:true})

   

  } catch (error) {
    // 6️⃣ في حالة حدوث خطأ
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const receiverId = req.params.id;
    const sender = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      sender,
      receiver: receiverId, // ✅ أهم تعديل
      text,
      image: imageUrl
    });

    const reciverSocketId = userSocketMap[receiverId];
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      message: "تم إرسال الرسالة بنجاح",
      newMessage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
