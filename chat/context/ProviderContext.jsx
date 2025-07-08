import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();
const BackendUrl = import.meta.env.VITE_BACKEND_URL;

// إعداد الـ base URL
axios.defaults.baseURL = BackendUrl;

// ✅ Interceptor لإضافة التوكن تلقائيًا
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ مهم جدًا
  const nav = useNavigate();

  console.log(token);
  console.log(authUser)

  // ✅ أول تحميل
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    } else {
      setLoading(false); // لا يوجد توكن → لا داعي للتحقق
    }
  }, []);

  // ✅ عند تغيير التوكن، تحقق من المستخدم
  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token]);

  // ✅ التحقق من المستخدم الحالي
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        nav("/login");
      }
      toast.error(
        error?.response?.data?.message || error.message || "Auth failed"
      );
    } finally {
      setLoading(false); // ✅ سواء نجح أو فشل
    }
  };

  // ✅ تسجيل الدخول أو إنشاء حساب
  const Login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        const receivedToken = data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
        setToken(receivedToken);
        localStorage.setItem("token", receivedToken);
        toast.success(data.message);
        nav("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Login failed"
      );
    }
  };

  // ✅ تسجيل الخروج
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    delete axios.defaults.headers.common["Authorization"];
    if (socket) socket.disconnect();
    toast.success("Logged out successfully");
  };

  // ✅ تحديث البروفايل
  const updateProfile = async (body) => {
    try {
     const { data } = await axios.put("/api/auth/update-profile", body, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // ⬅️ أضف التوكن يدويًا هنا
  },
});
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
        nav('/')
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Update failed"
      );
    }
  };

  // ✅ توصيل Socket.io
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(BackendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };

  const isAuthenticated = !!authUser;

  const val = {
    axios,
    authUser,
    onlineUser,
    socket,
    token,
    isAuthenticated,
    logout,
    Login,
    updateProfile,
    loading, // ✅ أضفها هنا
  };

  return <AppContext.Provider value={val}>{children}</AppContext.Provider>;
};

export const UseAppContext = () => useContext(AppContext);
