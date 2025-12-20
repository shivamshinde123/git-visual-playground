import React from 'react';
import { Cloud, Upload, Download } from 'lucide-react';

const RemoteOperations = ({ handlePush, setShowPullDialog, remoteBranches }) => {
  return (
    <div className="col-span-2 bg-gray-750 border border-gray-600 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Cloud className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-gray-200">Remote</h3>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={handlePush}
          className="w-full flex items-center justify-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
        >
          <Upload className="w-3 h-3" />
          Push
        </button>
        <button
          onClick={() => setShowPullDialog(true)}
          disabled={Object.keys(remoteBranches).length === 0}
          className="w-full flex items-center justify-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          <Download className="w-3 h-3" />
          Pull
        </button>
      </div>
    </div>
  );
};

export default RemoteOperations;