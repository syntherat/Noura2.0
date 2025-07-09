import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import RegisterForm from '../../components/auth/RegisterForm.jsx';
import logo from '../../assets/noura-logo.png';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
        
        {/* Left Gradient Section */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-10">
          <img src={logo} alt="Logo" className='py-5'/>
          <h2 className="text-3xl font-semibold mb-4">Welcome to Noura</h2>
          <p className="max-w-md text-center">
            Transform your study routine with AI-powered personalized learning plans
          </p>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>

      </div>
    </div>
  );
}
