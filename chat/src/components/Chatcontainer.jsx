import React, { useEffect, useRef } from 'react';
import assets from '../assets/assets';
import { FormatMessageTime } from '../lib/utilis';
import { useChatContext } from '../../context/ChatContext';
import { UseAppContext } from '../../context/ProviderContext';

function Chatcontainer() {
  const {
    selectedUser,
    setSelectedUser,
    messages,
    newMessage,
    setNewMessage,
    sendMessages,
  } = useChatContext();

  const { authUser } = UseAppContext();

  const scrollEnd = useRef();

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessages({ text: newMessage });
      setNewMessage('');
    }
  };

  // Scroll to latest message
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 text-white h-full'>
        <img src={assets.logo_icon} className='w-16' alt="logo" />
        <p className='text-lg font-medium'>ابدأ محادثة مع أي شخص</p>
      </div>
    );
  }

  return (
    <div className='px-4 py-4 h-full overflow-hidden relative backdrop-blur-xl text-white flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            className='w-12 h-12 rounded-full object-cover'
            alt="user"
          />
          <div>
            <h2 className='font-bold text-lg'>{selectedUser.name}</h2>
            <span className={`text-xs ${selectedUser.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
              {selectedUser.isOnline ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {/* رجوع للموبايل */}
          <img
            onClick={() => setSelectedUser(null)}
            className='w-6 h-6 md:hidden cursor-pointer'
            src={assets.arrow_icon}
            alt="رجوع"
          />
          <img
            src={assets.help_icon}
            className='w-6 h-6 hidden md:block cursor-pointer'
            alt="مساعدة"
          />
        </div>
      </div>

      <hr className='border-gray-600' />

      {/* Messages */}
      <div className='flex-1 overflow-y-auto py-4 px-2 space-y-4 scroll-smooth'>
        {messages.map((mes, index) => {
          const isOwnMessage = mes.sender === authUser?._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwnMessage && (
                <img
                  src={selectedUser.profilePic || assets.avatar_icon}
                  className='w-8 h-8 rounded-full object-cover'
                  alt="sender"
                />
              )}

              <div className={`max-w-xs rounded-xl px-4 py-2 text-sm border shadow 
                ${isOwnMessage ? 'bg-violet-500/30 border-violet-400 text-right' : 'bg-[#25213b] border-gray-600 text-left'}`}>
                
                {mes.image
                  ? <img src={mes.image} className='max-w-[200px] rounded-md' alt="img" />
                  : <p>{mes.text}</p>
                }

                <p className='text-gray-400 text-[10px] mt-1' dir='ltr'>
                  {FormatMessageTime(mes.createdAt)}
                </p>
              </div>

              {isOwnMessage && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  className='w-8 h-8 rounded-full object-cover'
                  alt="me"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Field */}
      <div className="mt-3 flex items-center gap-2 bg-[#2c2b3f] p-2 rounded-xl shadow-inner">
        <input
          type="text"
          placeholder="اكتب رسالتك..."
          className="flex-1 bg-transparent outline-none text-white px-3 py-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm transition"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}

export default Chatcontainer;
