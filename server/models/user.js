import mongoose from "mongoose";

// 🧱 تعريف مخطط المستخدم (User Schema)
const userSchema = new mongoose.Schema(
  {
    // البريد الإلكتروني
    email: {
      type: String,
      required: true,
      unique: true, // من الأفضل إضافتها لتجنب التكرار
      lowercase: true, // يحوّل الإيميل لحروف صغيرة
      trim: true
    },

    // الاسم
    name: {
      type: String,
      required: true,
      trim: true
    },

    // كلمة المرور
    password: {
      type: String,
      required: true
    },

    // صورة الملف الشخصي (رابط URL أو اسم ملف)
    profilePic: {
      type: String,
      default: '' // أفضلية وضع قيمة افتراضية
    },

    // نبذة عن المستخدم (bio)
    bio: {
      type: String,
     
    }
  },
  {
    timestamps: true // يضيف حقلي createdAt و updatedAt تلقائيًا
  }
);

// 📦 إنشاء النموذج (Model)
export const User = mongoose.model("User", userSchema);
