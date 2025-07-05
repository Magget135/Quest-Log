import React from 'react';

const TimezoneFooter = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-600">
          Time shown in {timezone} (UTC{new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)})
        </div>
      </div>
    </footer>
  );
};

export default TimezoneFooter;