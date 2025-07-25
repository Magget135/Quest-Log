import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from './ui/badge';

const NavigationDropdown = ({ 
  icon, 
  label, 
  badge, 
  items, 
  isActive,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const isAnyItemActive = items.some(item => location.pathname === item.path);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    timeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsOpen(false);
      }
    }, 200);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsHovered(false);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="h-full w-auto inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Navigation Item */}
      <div
        onClick={handleClick}
        className={`flex items-center space-x-2 px-4 py-4 border-b-4 transition-colors duration-200 cursor-pointer h-full min-w-0 flex-shrink-0 relative ${
          isActive || isAnyItemActive
            ? 'border-blue-600 bg-blue-50 text-blue-800'
            : 'border-transparent text-gray-700 hover:text-blue-700 hover:bg-blue-50'
        } ${className}`}
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        <span className="text-lg">{icon}</span>
        <span className="font-medium whitespace-nowrap">{label}</span>
        {badge && (
          <div className="medieval-scroll px-2 py-1">
            <Badge className="bg-yellow-600 text-yellow-100 text-xs font-bold">
              {badge}
            </Badge>
          </div>
        )}
        <span className={`text-xs text-blue-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 z-50 bg-white border-2 border-blue-600 rounded-lg shadow-2xl w-64 medieval-scroll"
          style={{ position: 'absolute' }}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <div className="py-2">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
                }`}
                style={{ fontFamily: 'Libre Baskerville, serif' }}
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                  )}
                </div>
                {item.badge && (
                  <div className="medieval-scroll px-2 py-1">
                    <Badge className="bg-blue-600 text-white text-xs font-bold">
                      {item.badge}
                    </Badge>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;