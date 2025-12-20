import React from 'react';
import { GitCommit } from 'lucide-react';

const CommitDetailsPanel = ({ selectedCommit, commits, setSelectedCommit }) => {
  const selectedCommitData = commits.find(c => c.id === selectedCommit);
  
  if (!selectedCommitData) return null;

  return (
    <div className="absolute top-4 right-4 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-200 flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-emerald-400" />
          Commit Details
        </h3>
        <button
          onClick={() => setSelectedCommit(null)}
          className="text-gray-500 hover:text-gray-300 text-2xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="font-semibold text-gray-400">Hash:</span>
          <div className="text-emerald-400 font-mono text-xs mt-1">{selectedCommitData.id}</div>
        </div>
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="font-semibold text-gray-400">Message:</span>
          <div className="text-gray-200 mt-1">{selectedCommitData.message}</div>
        </div>
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="font-semibold text-gray-400">Branch:</span>
          <div className="text-gray-200 mt-1">{selectedCommitData.branch}</div>
        </div>
        {selectedCommitData.isMerge && (
          <div className="bg-purple-900 bg-opacity-30 p-2 rounded border border-purple-700">
            <span className="font-semibold text-purple-400">🔀 Merge Commit</span>
          </div>
        )}
        <div className="bg-gray-900 p-2 rounded border border-gray-700">
          <span className="font-semibold text-gray-400">Time:</span>
          <div className="text-gray-200 text-xs mt-1">
            {new Date(selectedCommitData.timestamp).toLocaleString()}
          </div>
        </div>
        {selectedCommitData.parents.length > 0 && (
          <div className="bg-gray-900 p-2 rounded border border-gray-700">
            <span className="font-semibold text-gray-400">Parent{selectedCommitData.parents.length > 1 ? 's' : ''}:</span>
            <div className="text-gray-200 font-mono text-xs mt-1 space-y-1">
              {selectedCommitData.parents.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitDetailsPanel;