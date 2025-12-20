import React from 'react';
import { Play, ChevronRight, GitCommit } from 'lucide-react';

const StagingArea = ({ stagingArea, removeFromStaging, commitMessage, setCommitMessage, handleCommit }) => {
  return (
    <div className="col-span-3 bg-gray-750 border border-gray-600 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Play className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-gray-200">Staging Area</h3>
      </div>
      <div className="space-y-1 max-h-24 overflow-y-auto">
        {stagingArea.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No staged changes</p>
        ) : (
          stagingArea.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 bg-emerald-900 bg-opacity-30 border border-emerald-700 rounded text-xs"
            >
              <span className="text-gray-200 truncate">{file.name}</span>
              <button
                onClick={() => removeFromStaging(file.id)}
                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                title="Unstage"
              >
                <ChevronRight className="w-3 h-3 rotate-180" />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="mt-2 space-y-1">
        <input
          type="text"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Commit message"
          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
          disabled={stagingArea.length === 0}
        />
        <button
          onClick={handleCommit}
          disabled={stagingArea.length === 0 || !commitMessage.trim()}
          className="w-full flex items-center justify-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-xs disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          <GitCommit className="w-3 h-3" />
          Commit
        </button>
      </div>
    </div>
  );
};

export default StagingArea;