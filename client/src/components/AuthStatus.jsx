import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { LogOut, User, Shield, CheckCircle } from 'lucide-react';
import { TranslatedText } from '../hooks/useAutoTranslation.jsx';

const AuthStatus = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-30">
        <div className="flex items-center space-x-2 text-orange-600">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium">
            <TranslatedText text="Not Logged In" />
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          <TranslatedText text="Click chat or feedback to login" />
        </p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-green-200 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-sm font-medium text-green-800">
              <TranslatedText text="Logged In" />
            </div>
            <div className="text-xs text-gray-600">
              {user?.name || user?.phone || 'Demo User'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AuthStatus;
