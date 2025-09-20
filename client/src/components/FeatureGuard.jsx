import React from 'react';
import { useAuth } from './AuthProvider_Real';
import { Lock, UserPlus } from 'lucide-react';

const FeatureGuard = ({ 
  children, 
  featureName = "this feature", 
  fallbackMessage = null,
  showLoginPrompt = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If authenticated, show the feature
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, show restriction message
  if (fallbackMessage) {
    return fallbackMessage;
  }

  // Default restriction UI
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Sign in Required
      </h3>
      <p className="text-gray-600 mb-4">
        Please sign in to access {featureName}
      </p>
      {showLoginPrompt && (
        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center mx-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Sign In
        </button>
      )}
    </div>
  );
};

export default FeatureGuard;