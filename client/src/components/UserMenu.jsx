import React, { useState } from 'react';
import { useAuth } from './AuthProvider_Real';
import { LogOut, User } from 'lucide-react';

const UserMenu = () => {
  const { user, userProfile, isAuthenticated, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // Reload the page to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-700">
            {userProfile?.full_name || user?.email || 'User'}
          </p>
          <p className="text-xs text-gray-500">
            Level {userProfile?.level || 1} • {userProfile?.points || 0} XP
          </p>
        </div>
      </div>
      
      <button
        onClick={handleSignOut}
        disabled={isLoggingOut}
        className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
        title="Sign Out"
      >
        {isLoggingOut ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span className="hidden md:inline text-sm">Sign Out</span>
      </button>
    </div>
  );
};

export default UserMenu;