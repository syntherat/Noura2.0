import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Generate display name based on available data
  const displayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim() 
    : user?.username || '';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/app" className="text-xl font-bold text-gray-800">
              Noura
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/app/plans" className="text-gray-600 hover:text-gray-900">
                My Plans
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
              <div className="ml-4 flex items-center">
                {displayName && (
                  <span className="text-gray-700 font-medium">
                    {displayName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}