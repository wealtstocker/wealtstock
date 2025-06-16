import React from 'react';

const FilterToolbar = ({ searchTerm, onSearchChange, startDate, endDate, onDateChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by ID or Ref..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border px-3 py-2 rounded-md shadow-sm w-full md:w-64"
      />

      {/* Date Range */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onDateChange('start', e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
        <label className="text-sm text-gray-600">To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onDateChange('end', e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
      </div>
    </div>
  );
};

export default FilterToolbar;