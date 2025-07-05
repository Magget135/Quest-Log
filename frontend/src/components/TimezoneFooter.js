import React from 'react';
import { getUserTimezone, getTimezoneDisplayName } from '../utils/timeUtils';

const TimezoneFooter = () => {
  const currentTimezone = getUserTimezone();
  const displayName = getTimezoneDisplayName(currentTimezone);
  
  return (
    <div className="bg-gray-50 border-t border-gray-200 py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs text-gray-500 text-center">
          🌍 Times shown in {displayName}
        </p>
      </div>
    </div>
  );
};

export default TimezoneFooter;