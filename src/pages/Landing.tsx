import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import image from '../assets/image.png';

// Component: Landing
const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
          <h1 className="text-4xl font-bold text-left mb-4">Welcome to Reporting Scheduler</h1>
          <p className="text-left mb-8">This project helps you manage and schedule your reports efficiently. Get started by logging in or registering an account.</p>
          <div className="space-y-4">
            <Link to="/login" className="block w-full text-center px-4 py-2 text-white bg-[#9854CB] rounded hover:bg-[#C49BD9]">
              Already have an account? Login
            </Link>
            <Link to="/register" className="block w-full text-center px-4 py-2 text-[#9854CB] border border-[#9854CB] rounded bg-white hover:bg-[#DDACF5]">
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
