import React, { useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { UseAppContext } from '../../context/ProviderContext';
import { useChatContext } from '../../context/ChatContext';
import m from '../assets/ahmed.png';
function Sidebar() {
  const nav = useNavigate();

  const { logout, authUser } = UseAppContext();
  const {
    users,
    unseenMessages,
    setUnseenMessages,
    selectedUser,
    setSelectedUser,
    getSelectedUsers
  } = useChatContext();

  const [input, setInput] = useState('');

  const filteredUsers = input
    ? users.filter((user) =>
        user.name.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    getSelectedUsers(user._id);

    setUnseenMessages((prev) => {
      const updated = { ...prev };
      delete updated[user._id];
      return updated;
    });
  };

  return (
    <div
      className={`bg-[#0F0F1A] h-full p-4 rounded-r-xl overflow-y-auto text-white 
        transition-all duration-300 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-[80%] max-md:z-50 
        ${selectedUser ? 'max-md:hidden' : ''}`}
    >
      {/* العنوان */}
      <div className="flex items-center justify-between pb-4">
        <img src={m} loading="lazy" alt="logo" className="w-[40px] rounded-full" />
        <div className="relative group">
          <img loading="lazy"
            key={authUser?.profilePic} // ✅ حل مشكلة الكاش
            src={
              authUser?.profilePic
                ? `${authUser.profilePic}?t=${Date.now()}`
                : assets.menu_icon
            }
            className="h-8 w-8 rounded-full cursor-pointer object-cover border-2 border-gray-400"
            alt="menu"
          />
          <div className="absolute top-full right-0 mt-2 z-20 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 
            hidden group-hover:block w-44">
            <p
              onClick={() => nav('/profile')}
              className="cursor-pointer hover:text-purple-300 mb-2 border-b border-gray-500 pb-1 text-sm"
            >
              تعديل الملف الشخصي
            </p>
            <p
              onClick={logout}
              className="cursor-pointer text-sm hover:text-red-400"
            >
              تسجيل الخروج
            </p>
          </div>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="bg-[#1F1B3B] rounded-full flex items-center gap-3 px-4 py-2 mt-2 mb-4">
        <img src={assets.search_icon} className="w-4" loading="lazy" alt="search" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="bg-transparent border-none outline-none text-white placeholder-[#a0a0a0] flex-1 text-sm"
          placeholder="ابحث عن مستخدم"
        />
      </div>

      {/* المستخدمين */}
      <div className="flex flex-col gap-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`flex items-center gap-3 p-2 rounded-md transition-all duration-200 cursor-pointer relative
              ${selectedUser?._id === user._id ? 'bg-violet-700/50' : 'hover:bg-[#292448]'}`}
          >
            <img
            loading="lazy"
              src={user?.profilePic || assets.avatar_icon}
              alt="avatar"
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div className="flex flex-col flex-1">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <span
                className={`text-xs ${
                  user.isOnline ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                {user.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

          {user.unreadCount > 0 && (
  <span className="text-xs bg-purple-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
    {user.unreadCount}
  </span>
)}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
