import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-black uppercase tracking-widest mb-12 border-b border-gray-200 pb-6">
        My Account
      </h1>

      <div className="bg-gray-50 p-8 rounded-sm">
        <div className="mb-8">
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-500 mb-2">
            Profile Information
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Name</p>
              <p className="text-lg font-medium text-black">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Email</p>
              <p className="text-lg font-medium text-black">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleLogout} className="uppercase tracking-widest">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
