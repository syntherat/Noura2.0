import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import GoogleAuth from './GoogleAuth.jsx';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Basic validation
      if (!formData.firstName) {
        toast.error('First name is required');
        return;
      }
      if (!formData.email) {
        toast.error('Email is required');
        return;
      }
      if (!formData.password) {
        toast.error('Password is required');
        return;
      }
      if (!validatePassword(formData.password)) {
        toast.error('Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (!agree) {
        toast.error('You must agree to the terms');
        return;
      }

      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (!result.success) {
        toast.error(result.message || 'Registration failed');
      } else {
        toast.success('Registration successful!');
      }
    } catch (error) {
      console.error("Register error:", error);
      if (error.response?.data?.message?.includes('already in use')) {
        toast.error('Email already exists');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
      <p className="text-gray-500 mb-6">Join us to start your learning journey</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">First Name</label>
            <input
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Last Name</label>
            <input
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Password</label>
          <div className="relative mt-1">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
          <div className="relative mt-1">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <p className="text-sm text-gray-600">
            I agree to the <a href="#" className="text-indigo-600 underline">Terms of Service</a> and <a href="#" className="text-indigo-600 underline">Privacy Policy</a>
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !agree}
          className="bg-indigo-600 text-white font-medium py-2 rounded-md w-full hover:bg-indigo-700 transition disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Google */}
      <GoogleAuth />

      {/* Footer */}
      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
      </p>

      <p className="text-xs text-center text-gray-400 mt-2">
        By creating an account, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
      </p>
    </>
  );
}