import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import GoogleAuth from './GoogleAuth.jsx';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // install with `npm i lucide-react`

export default function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agree) {
      newErrors.agree = 'You must agree to the terms';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    });

    setLoading(false);
    if (!result.success) {
      toast.error(result.message);
    }

  } catch (error) {
    console.error("Register error:", error);
    setLoading(false);
    toast.error("Something went wrong");
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
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
            onChange={(e) => {
              setAgree(e.target.checked);
              if (errors.agree) setErrors({ ...errors, agree: null });
            }}
          />
          <p className="text-sm text-gray-600">
            I agree to the <a href="#" className="text-indigo-600 underline">Terms of Service</a> and <a href="#" className="text-indigo-600 underline">Privacy Policy</a>
          </p>
        </div>
        {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !agree}
          className="bg-indigo-600 text-white font-medium py-2 rounded-md w-full hover:bg-indigo-700 transition"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t"></div>
        <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
        <div className="flex-grow border-t"></div>
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
