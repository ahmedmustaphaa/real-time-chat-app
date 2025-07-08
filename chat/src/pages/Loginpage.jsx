import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ahmed from '../assets/ahmed.png';
import { UseAppContext } from '../../context/ProviderContext';
import ClipLoader from 'react-spinners/ClipLoader';

function Loginpage() {
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [loading, setLoading] = useState(false);

  const { Login } = UseAppContext();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFullName('');
    setEmail('');
    setPassword('');
    setBio('');
    setAgreeTerms(false);
    setShowBio(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (!agreeTerms) {
        alert('You must agree to the terms!');
        return;
      }

      if (!showBio) {
        setShowBio(true);
        return;
      }

      setLoading(true);
      await Login('register', {
        name: fullName,
        email,
        password,
        bio,
      });
      setLoading(false);
    } else {
      setLoading(true);
      await Login('login', { email, password });
      setLoading(false);
    }
  };

  return (
    <div className='relative min-h-screen w-[80%] m-auto px-4 sm:px-[10%] py-10 sm:py-[5%] backdrop-blur-xl rounded-2xl'>

      {/* ✅ Helmet for SEO */}
      <Helmet>
        <title>{isLogin ? 'Login | Chat App' : 'Sign Up | Chat App'}</title>
        <meta
          name="description"
          content={isLogin
            ? "Login to your account and start chatting instantly with your friends on our real-time MERN chat app."
            : "Create a new account and start enjoying real-time messaging on our MERN stack chat platform."}
        />
      </Helmet>

      <div className='flex flex-col lg:flex-row justify-between items-center gap-10'>
        <img src={ahmed} loading="lazy" className='w-28 h-28 sm:w-32 sm:h-32 rounded-full' alt="Profile" />

        <form
          onSubmit={handleSubmit}
          className='w-full lg:w-[45%] bg-[#8185b2]/10 text-white px-6 py-6 border-2 border-gray-600 shadow-lg rounded-2xl'
        >
          {!showBio && (
            <h1 className='text-2xl font-bold mb-4'>
              {isLogin ? 'Login' : 'Sign Up'}
            </h1>
          )}

          {!isLogin && (
            <input
              type='text'
              className='outline-none my-3 placeholder:font-bold border-2 border-[#6A7282] rounded-lg w-full px-3 py-2'
              placeholder='Full name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <input
            type='email'
            className='outline-none my-3 placeholder:font-bold border-2 border-[#6A7282] rounded-lg w-full px-3 py-2'
            placeholder='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type='password'
            className='outline-none my-3 placeholder:font-bold border-2 border-[#6A7282] rounded-lg w-full px-3 py-2'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <div className='items-center flex gap-2 mt-4'>
              <input
                type="checkbox"
                className="accent-[#B56EFF]"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <p className='text-[14px] text-[#6A7282]'>
                Agree to the terms of use & privacy policy.
              </p>
            </div>
          )}

          {!isLogin && showBio && (
            <>
              <textarea
                className='outline-none my-3 placeholder:font-bold border-2 border-[#6A7282] rounded-lg w-full px-3 py-2'
                placeholder='Short Bio'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-[80%] m-auto mt-3 flex justify-center items-center bg-[#00cc99] hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 ease-in-out"
              >
                {loading ? <ClipLoader color="#fff" size={20} /> : "Finish Sign Up"}
              </button>
            </>
          )}

          {(isLogin || !showBio) && (
            <button
              type="submit"
              disabled={loading}
              className="w-[80%] m-auto mt-6 flex justify-center items-center bg-[#B56EFF] hover:bg-[#DA70D6] text-white font-medium py-2 px-6 rounded-lg transition duration-300 ease-in-out"
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : (isLogin ? 'Login' : 'Create Account')}
            </button>
          )}

          <p className='text-[14px] mt-10 text-[#6A7282] text-center'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <span
              onClick={toggleMode}
              className='text-[#8837FF] underline cursor-pointer'
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
