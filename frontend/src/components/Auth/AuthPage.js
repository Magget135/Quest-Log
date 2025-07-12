import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, User, Mail, Shield, Sword } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    email_or_username: ''
  });
  const [errors, setErrors] = useState({});
  
  const { login, register, isLoading, error, clearError } = useAuth();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (isLogin) {
      if (!formData.email_or_username.trim()) {
        newErrors.email_or_username = 'Email or username is required';
      }
    } else {
      // Registration validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email format is invalid';
      }
      
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
        newErrors.username = 'Username must be 3-20 characters, alphanumeric and underscores only';
      }
    }
    
    // Password validation for both login and register
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    if (isLogin) {
      const result = await login({
        email_or_username: formData.email_or_username,
        password: formData.password
      });
      
      if (!result.success) {
        setErrors({ submit: result.error });
      }
    } else {
      const result = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      
      if (!result.success) {
        setErrors({ submit: result.error });
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      username: '',
      password: '',
      display_name: '',
      email_or_username: ''
    });
    setErrors({});
    clearError();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJhIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPgogICAgICA8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz4KPC9zdmc+')] opacity-30"></div>
      
      <div className="relative w-full max-w-md">
        {/* Main Auth Card */}
        <div className="bg-amber-50 border-4 border-amber-900 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-6 py-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sword className="w-8 h-8 text-amber-200" />
              <h1 className="text-2xl font-bold text-amber-100">Quest Tavern</h1>
              <Shield className="w-8 h-8 text-amber-200" />
            </div>
            <p className="text-amber-200 text-sm">
              {isLogin ? 'Welcome back, adventurer!' : 'Begin your epic journey!'}
            </p>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display global error */}
              {(error || errors.submit) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error || errors.submit}
                </div>
              )}
              
              {/* Registration Fields */}
              {!isLogin && (
                <>
                  {/* Email Field */}
                  <div>
                    <label className="block text-amber-900 text-sm font-semibold mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-amber-300 bg-white'
                      }`}
                      placeholder="adventurer@questtavern.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Username Field */}
                  <div>
                    <label className="block text-amber-900 text-sm font-semibold mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.username ? 'border-red-500 bg-red-50' : 'border-amber-300 bg-white'
                      }`}
                      placeholder="brave_hero"
                    />
                    {errors.username && (
                      <p className="text-red-600 text-xs mt-1">{errors.username}</p>
                    )}
                  </div>
                  
                  {/* Display Name Field */}
                  <div>
                    <label className="block text-amber-900 text-sm font-semibold mb-2">
                      RPG Character Name
                    </label>
                    <input
                      type="text"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.display_name ? 'border-red-500 bg-red-50' : 'border-amber-300 bg-white'
                      }`}
                      placeholder="Brave Adventurer"
                    />
                    {errors.display_name && (
                      <p className="text-red-600 text-xs mt-1">{errors.display_name}</p>
                    )}
                  </div>
                </>
              )}
              
              {/* Login Field */}
              {isLogin && (
                <div>
                  <label className="block text-amber-900 text-sm font-semibold mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Email or Username
                  </label>
                  <input
                    type="text"
                    name="email_or_username"
                    value={formData.email_or_username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.email_or_username ? 'border-red-500 bg-red-50' : 'border-amber-300 bg-white'
                    }`}
                    placeholder="email@example.com or username"
                  />
                  {errors.email_or_username && (
                    <p className="text-red-600 text-xs mt-1">{errors.email_or_username}</p>
                  )}
                </div>
              )}
              
              {/* Password Field */}
              <div>
                <label className="block text-amber-900 text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-amber-300 bg-white'
                    }`}
                    placeholder={isLogin ? 'Enter your password' : 'Min 8 chars, 1 number'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-600 hover:text-amber-800"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                )}
                {!isLogin && (
                  <p className="text-amber-700 text-xs mt-1">
                    Password must be at least 8 characters and contain 1 number
                  </p>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-4 rounded-md transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  <span>{isLogin ? '🗡️ Enter Tavern' : '⚔️ Join Adventure'}</span>
                )}
              </button>
            </form>
            
            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <p className="text-amber-800 text-sm">
                {isLogin ? "New to the tavern?" : "Already have an account?"}
              </p>
              <button
                onClick={switchMode}
                className="text-amber-600 hover:text-amber-800 font-semibold text-sm mt-1 underline"
              >
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-4 text-white/80 text-sm">
          <p>🏰 Welcome to the Quest Tavern RPG System 🏰</p>
        </div>
      </div>
    </div>
  );
}