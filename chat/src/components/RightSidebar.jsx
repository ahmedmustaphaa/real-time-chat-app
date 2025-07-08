import React from 'react';
import m from '../assets/ahmed.png';
import { UseAppContext } from '../../context/ProviderContext';

function RightSidebar() {
  const { logout } = UseAppContext();

  return (
    <div className="w-full md:w-[300px] hidden md:block bg-[#8185b2]/10 text-white flex flex-col items-center py-8 px-4 md:rounded-l-2xl shadow-lg h-full relative">
      
      {/* الصورة والاسم والبروفايل */}
      <div className="flex flex-col items-center space-y-4">
        <img
        loading="lazy"
          src={m}
          alt="Ahmed Mustafa"
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-4 border-[#1F1F2B]"
        />
        
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Ahmed Mustafa
          </span>
        </h1>

        <p className="text-xs md:text-sm text-gray-400 text-center leading-5">
          Hi Everyone,<br />
          I am using this website
        </p>
      </div>

      {/* خط فاصل */}
      <hr className="w-full border-t border-gray-700 my-6 md:my-8" />

      {/* زر تسجيل الخروج */}
      <button
        onClick={logout}
        className="w-[90%] bg-[#B56EFF] hover:[#DA70D6] text-white font-medium py-2 px-6 rounded-lg absolute bottom-4 md:bottom-6 transition duration-300 ease-in-out"
      >
        Logout
      </button>
    </div>
  );
}

export default RightSidebar;
