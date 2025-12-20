import React from 'react';
import { FileText, ChevronRight, Plus } from 'lucide-react';

const WorkingDirectory = ({ workingDirectory, addToStaging, setShowAddFileDialog }) => {
  return (
    <div className="col-span-3 bg-gray-750 border border-gray-600 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-gray-200">Working Directory</h3>
      </div>
      <div className="space-y-1 max-h-24 overflow-y-auto">
        {workingDirectory.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No changes</p>
        ) : (
          workingDirectory.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 bg-orange-900 bg-opacity-30 border border-orange-700 rounded text-xs"
            >
              <span className="text-gray-200 truncate">{file.name}</span>
              <button
                onClick={() => addToStaging(file.id)}
                className="p-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                title="Git Add"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => setShowAddFileDialog(true)}
        className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 text-xs"
      >
        <Plus className="w-3 h-3" />
        Add File
      </button>
    </div>
  );
};

export default WorkingDirectory;