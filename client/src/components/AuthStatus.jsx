import React from "react";
import { useAuth } from "../components/AuthProvider";
import { LogOut, User, Shield, CheckCircle } from "lucide-react";
import { TranslatedText } from "../hooks/useAutoTranslation.jsx";

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
      </div>
    );
};

}

export default AuthStatus;
