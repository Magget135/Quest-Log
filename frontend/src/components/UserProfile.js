import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAvatar, fileToBase64, validateImageFile } from '../utils/avatarUtils';
import { User, Mail, Calendar, Camera, Save, X, LogOut } from 'lucide-react';

export default function UserProfile({ isOpen, onClose }) {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.display_name || '',
    profile_picture: user?.profile_picture || ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  
  if (!isOpen || !user) return null;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrors({ avatar: validation.error });
      return;
    }
    
    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, profile_picture: base64 }));
      setPreviewAvatar(base64);
      setErrors(prev => ({ ...prev, avatar: '' }));
    } catch (error) {
      setErrors({ avatar: 'Failed to process image' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    } else if (formData.display_name.trim().length < 2 || formData.display_name.trim().length > 50) {
      newErrors.display_name = 'Display name must be 2-50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const updateData = {
      display_name: formData.display_name.trim()
    };
    
    if (previewAvatar) {
      updateData.profile_picture = formData.profile_picture;
    }
    
    const result = await updateProfile(updateData);
    
    setIsLoading(false);
    
    if (result.success) {
      setIsEditing(false);
      setPreviewAvatar(null);
    } else {
      setErrors({ submit: result.error });
    }
  };
  
  const handleCancel = () => {
    setFormData({
      display_name: user.display_name,
      profile_picture: user.profile_picture
    });
    setPreviewAvatar(null);
    setErrors({});
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  const currentAvatar = previewAvatar || getUserAvatar(user, 120);
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-amber-50 border-4 border-amber-900 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-4 py-3 rounded-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-amber-100 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Adventurer Profile
            </h3>
            <button
              onClick={onClose}
              className="text-amber-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {errors.submit}
            </div>
          )}
          
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={currentAvatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-4 border-amber-600 shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.avatar && (
              <p className="text-red-600 text-xs mt-1">{errors.avatar}</p>
            )}
            {isEditing && (
              <p className="text-amber-700 text-xs mt-1">
                Click camera icon to change avatar (max 2MB)
              </p>
            )}
          </div>
          
          {/* User Info */}
          <div className="space-y-3">
            {/* Display Name */}
            <div>
              <label className="block text-amber-900 text-sm font-semibold mb-1">
                Character Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.display_name ? 'border-red-500 bg-red-50' : 'border-amber-300 bg-white'
                  }`}
                  placeholder="Enter your character name"
                />
              ) : (
                <p className="bg-amber-100 px-3 py-2 rounded-md border border-amber-300 text-amber-900">
                  {user.display_name}
                </p>
              )}
              {errors.display_name && (
                <p className="text-red-600 text-xs mt-1">{errors.display_name}</p>
              )}
            </div>
            
            {/* Email (Read-only) */}
            <div>
              <label className="block text-amber-900 text-sm font-semibold mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <p className="bg-gray-100 px-3 py-2 rounded-md border border-gray-300 text-gray-700">
                {user.email}
              </p>
            </div>
            
            {/* Username (Read-only) */}
            <div>
              <label className="block text-amber-900 text-sm font-semibold mb-1">
                Username
              </label>
              <p className="bg-gray-100 px-3 py-2 rounded-md border border-gray-300 text-gray-700">
                {user.username}
              </p>
            </div>
            
            {/* Member Since */}
            <div>
              <label className="block text-amber-900 text-sm font-semibold mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Member Since
              </label>
              <p className="bg-gray-100 px-3 py-2 rounded-md border border-gray-300 text-gray-700">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}