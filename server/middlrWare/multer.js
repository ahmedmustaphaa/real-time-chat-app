import multer from "multer";

// تخزين الصورة في الذاكرة (Buffer)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
