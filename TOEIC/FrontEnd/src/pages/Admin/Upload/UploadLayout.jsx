// components/upload/UploadLayout.jsx
import React from 'react';

const UploadLayout = ({
  title,
  children,
  selectedFile,
  hasData,
  onUploadClick,
  onDiscard,
  onSave,
  saveButtonText = "💾 Save"
}) => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>

      {/* Upload Area */}
      <div
        onClick={onUploadClick}
        className="bg-white p-10 rounded-2xl shadow mb-8 text-center border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer"
      >
        <p>📂 Click để chọn file</p>
        {selectedFile && <p className="mt-2">📄 {selectedFile.name}</p>}
      </div>

      {/* Discard Button */}
      {hasData && (
        <button 
          onClick={onDiscard} 
          className="mb-6 w-full bg-red-500 text-white py-3 rounded-xl"
        >
          ❌ Discard
        </button>
      )}

      {children}

      {/* Save Button */}
      {hasData && (
        <button 
          onClick={onSave} 
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-xl"
        >
          {saveButtonText}
        </button>
      )}
    </div>
  );
};

export default UploadLayout;