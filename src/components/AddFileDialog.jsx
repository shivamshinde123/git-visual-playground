import React from 'react';
import { Plus, X } from 'lucide-react';

const AddFileDialog = ({ newFileName, setNewFileName, handleAddFile, setShowAddFileDialog }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-6 h-6 text-emerald-400" />
            Add New File
          </h3>
          <button
            onClick={() => setShowAddFileDialog(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            File Name
          </label>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="example.txt"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
            autoFocus
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddFileDialog(false)}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFile}
            disabled={!newFileName.trim()}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Add File
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFileDialog;