import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import image from '../assets/image.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Component: Register
const Register = () => {
  // State Hooks
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Helper Functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Event Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await register(email, password, name);
      console.log('Registration successful:', response.data);
      setNotification('Registration successful! Please log in.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  // JSX
  return (
    <div className="flex flex-col min-h-screen font-poppins bg-white md:flex-row">
      <div className="relative flex items-center justify-center bg-white md:flex-[2] md:order-2 rounded-tl-2xl rounded-bl-2xl md:bg-[#DDACF5]">
        <div className="absolute w-[80%] h-[50%] bg-[#DDACF5] rounded-tl-lg rounded-bl-lg rounded-tr-lg" style={{ top: '50%', transform: 'translateY(-50%)' }}></div>
        <img 
          src={image} 
          alt="Description" 
          className="relative w-4/5 h-auto" 
          draggable="false" 
          onContextMenu={(e) => e.preventDefault()} 
        />
      </div>
      <div className="flex items-center justify-center flex-[3] p-8 md:p-0 bg-white md:bg-transparent">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-left mb-8">Register</h2>
          {notification && <div className="text-green-500 mb-4">{notification}</div>} {/* Notification */}
          {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium">Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                onClick={() => setShowPassword(!showPassword)}
                style={{ top: '18px' }} 
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium">Confirm Password:</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ top: '18px' }} 
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-20 py-2 text-white bg-[#9854CB] rounded hover:bg-[#C49BD9] mt-6">
                Register
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>Already have an account? <Link to="/login" className="text-[#9854CB] hover:underline">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
