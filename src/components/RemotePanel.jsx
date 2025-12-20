import React from 'react';
import { Cloud, X } from 'lucide-react';

const RemotePanel = ({ remoteBranches, remoteCommits, setShowRemotePanel }) => {
  return (
    <div className="absolute top-4 left-4 bg-gray-800 border-2 border-blue-600 rounded-xl shadow-2xl p-4 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-200 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-400" />
          Remote Repository
        </h3>
        <button
          onClick={() => setShowRemotePanel(false)}
          className="text-gray-400 hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="font-semibold text-gray-400">Branches:</span>
          <div className="mt-1 space-y-1">
            {Object.keys(remoteBranches).map(branch => (
              <div key={branch} className="flex items-center justify-between">
                <span className="text-gray-200">{branch}</span>
                <span className="text-xs text-gray-500 font-mono">{remoteBranches[branch]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="font-semibold text-gray-400">Commits:</span>
          <div className="text-gray-200 mt-1">{remoteCommits.length}</div>
        </div>
      </div>
    </div>
  );
};

export default RemotePanel;