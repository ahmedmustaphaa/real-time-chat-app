import { createContext, useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { UseAppContext } from "./ProviderContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket, authUser,axios } = UseAppContext();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unseenMessages, setUnseenMessages] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false); // ✅
  const [loadingMessages, setLoadingMessages] = useState(false); // ✅
  const [sendingMessage, setSendingMessage] = useState(false); // ✅

  // ✅ Get all users except authUser
  const getSidebarUser = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await axios.get("/api/message/get-user");
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ✅ Get messages between current and selected user
  const getSelectedUsers = async (userId) => {
    try {
      setLoadingMessages(true);
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessages(data.messages);

        const unseen = data.messages.filter(
          (msg) => !msg.seen && msg.receiverId === authUser._id
        );

        unseen.forEach((msg) => {
          axios.put(`/api/message/mark/${msg._id}`);
        });

        setUnseenMessages((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ✅ Receive messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (selectedUser && msg.sender === selectedUser._id) {
        msg.seen = true;
        setMessages((prev) => [...prev, msg]);
        axios.put(`/api/message/mark/${msg._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [msg.sender]: [...(prev[msg.sender] || []), msg],
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

  // ✅ Send message
  const sendMessages = async ({ text, image }) => {
    try {
      setSendingMessage(true);
      const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, {
        text,
        image,
        sender: authUser._id,
      });

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
        setNewMessage("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    getSidebarUser();
  }, []);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      const firstUser = users[0];
      setSelectedUser(firstUser);
      getSelectedUsers(firstUser._id);
    }
  }, [users]);

  const val = {
    users,
    messages,
    selectedUser,
    setSelectedUser,
    getSelectedUsers,
    sendMessages,
    newMessage,
    setNewMessage,
    unseenMessages,
    setUnseenMessages,
    loadingUsers,         // ✅ لتستخدمه في Sidebar
    loadingMessages,      // ✅ لتستخدمه في ChatContainer
    sendingMessage,       // ✅ لتستخدمه في زر الإرسال
  };

  return <ChatContext.Provider value={val}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => useContext(ChatContext);
