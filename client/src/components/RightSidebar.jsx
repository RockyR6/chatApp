import React from 'react';
import assets, { imagesDummyData } from '../assets/assets';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMegImages] = useState([])

  // Get all the images form the messages and set them to state
  useEffect(() => {
    setMegImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  },[messages])


  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full h-screen flex flex-col ${selectedUser ? "max-md:hidden" : ""}`}>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="Profile"
            className='w-20 aspect-[1/1] rounded-full'
          />
          <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2 whitespace-nowrap'>
            {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
            {selectedUser.fullName}
          </h1>
          <p className='px-10 mx-auto text-center'>{selectedUser.bio}</p>
        </div>

        <hr className='border-[#ffffff50] my-4' />

        <div className='px-5 text-xs pb-24'> 
          <p>Media</p>
          <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
            {msgImages.map((url, index) => (
              <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded'>
                <img src={url} alt="" className='h-full rounded-md' />
              </div>
            ))}
          </div>
        </div>
      </div>

    
      <div className="sticky bottom-0 left-0 right-0 bg-[#8185B2]/10 py-3 z-10">
        <button onClick={() => logout()} className='mx-auto block bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;