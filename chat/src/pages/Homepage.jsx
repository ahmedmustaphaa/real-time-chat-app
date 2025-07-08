import React from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../components/Sidebar';
import Chatcontainer from '../components/Chatcontainer';
import RightSidebar from '../components/RightSidebar';
import { useChatContext } from '../../context/ChatContext';

function Homepage() {
  const { selectedUser } = useChatContext();

  return (
    <div className="h-screen w-full sm:px-[10%] py-[2%] text-white">
      
      {/* ✅ Helmet لتحسين SEO */}
      <Helmet>
        <title>Chat | Real-Time Messaging App</title>
        <meta
          name="description"
          content="Welcome to your dashboard. Chat with friends in real-time using our secure and fast MERN chat application."
        />
      </Helmet>

      <div
        className={`
          backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden 
          h-full w-full grid relative transition-all duration-300
          ${selectedUser ? 'grid-cols-1 md:grid-cols-[1fr_2fr_1fr]' : 'grid-cols-1 md:grid-cols-[1fr_2fr]'}
        `}
      >
        <Sidebar />
        <Chatcontainer />
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
}

export default Homepage;
