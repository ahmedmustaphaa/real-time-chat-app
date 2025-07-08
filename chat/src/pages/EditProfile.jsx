import React, { useState } from 'react';
import { Helmet } from 'react-helmet'; // ✅ Helmet
import ahmed from '../assets/ahmed.png';
import { UseAppContext } from '../../context/ProviderContext';

function EditProfile() {
  const { authUser, updateProfile } = UseAppContext();

  const [image, setImage] = useState(null);
  const [email, setEmail] = useState(authUser?.email || '');
  const [bio, setBio] = useState(authUser?.bio || '');

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpdate = async () => {
    let base64Image;

    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        base64Image = reader.result;

        await updateProfile({
          profilePic: base64Image,
          email,
          bio,
        });
      };
    } else {
      await updateProfile({
        email,
        bio,
      });
    }
  };

  return (
    <div className='min-h-screen w-full bg-[#1a1a2e] text-white px-6 py-10 flex items-center justify-center'>
      {/* ✅ SEO Helmet */}
      <Helmet>
        <title>Edit Profile | MERN Chat App</title>
        <meta
          name="description"
          content="Edit your profile information including email, profile picture, and short bio. Keep your profile up to date!"
        />
      </Helmet>

      <div className='w-full max-w-5xl bg-[#25274D] backdrop-blur-xl border border-gray-600 rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-10'>

        {/* Left Side: Form */}
        <div>
          <h2 className='text-3xl font-bold mb-6 text-[#B56EFF]'>Edit Profile</h2>

          {/* Upload Image Section */}
          <div className="mb-6 flex items-center gap-6">
            <div className="relative">
              <img
              loading="lazy"
                src={image ? URL.createObjectURL(image) : authUser?.profilePic || ahmed}
                alt="Profile Preview"
                className="w-28 h-28 object-cover rounded-full border-4 border-[#B56EFF] shadow-md"
              />
              <label
                htmlFor="imageUpload"
                className="absolute bottom-0 right-0 bg-[#B56EFF] text-white p-1.5 rounded-full cursor-pointer hover:bg-[#9a4fd7] transition"
                title="Change Photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6M21 21H3V3h18v18z" />
                </svg>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </div>
          </div>

          {/* Email Input */}
          <label className='block mb-1 text-sm font-semibold text-gray-300'>Email Address</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='example@domain.com'
            className='mb-5 w-full px-4 py-2 bg-[#1f1f3a] border border-[#6A7282] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B56EFF]'
          />

          {/* Bio Input */}
          <label className='block mb-1 text-sm font-semibold text-gray-300'>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Tell us something about yourself...'
            className='mb-5 w-full h-32 px-4 py-2 bg-[#1f1f3a] border border-[#6A7282] rounded-lg placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#B56EFF]'
          ></textarea>

          <button
            onClick={handleUpdate}
            type='submit'
            className='w-full py-2 bg-[#B56EFF] hover:bg-[#9a4fd7] rounded-xl font-semibold transition duration-300'
          >
            Save Changes
          </button>
        </div>

        {/* Right Side: Current Profile Image */}
        <div className='flex flex-col items-center justify-center'>
          <img
            src={authUser?.profilePic || ahmed}
            alt="Current Profile"
            className='w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg'
          />
          <p className='mt-4 text-lg font-medium text-gray-200'>Your current profile photo</p>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
