import React from 'react';
import { FiDownload } from 'react-icons/fi';

const ExportButton = ({ onExportCSV, onExportPDF }) => {
  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        onClick={onExportCSV}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm shadow"
      >
        <FiDownload /> Export CSV
      </button>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm shadow"
      >
        <FiDownload /> Export PDF
      </button>
    </div>
  );
};

export default ExportButton;
