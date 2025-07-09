import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoginForm from '../../components/auth/LoginForm.jsx';
import logo from '../../assets/noura-logo.png'; // Assuming you have a logo or use text instead

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl shadow-xl overflow-hidden bg-white">
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-10 py-12">
          <img src={logo} alt="Noura Logo" className="h-7 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Welcome to Noura</h2>
          <p className="text-center text-sm">
            Transform your study routine with AI-powered personalized learning plans
          </p>
          <div className="flex mt-6 space-x-2">
            <span className="w-2 h-2 rounded-full bg-white opacity-70" />
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white opacity-70" />
          </div>
        </div>

        {/* Right panel - Login form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Welcome Back</h2>
          <p className="text-md text-gray-500 mb-6 text-center">Sign in to your account to continue</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
