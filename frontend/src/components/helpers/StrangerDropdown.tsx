import React from 'react';

const StrangerDropdown: React.FC = () => {
  return (
    <div className="relative inline-block text-left">
      <button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
        Options
      </button>
      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Report</button>
        </div>
      </div>
    </div>
  );
};

export default StrangerDropdown;
