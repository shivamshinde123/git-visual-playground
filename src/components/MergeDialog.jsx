import React from 'react';
import { GitMerge, X } from 'lucide-react';

const MergeDialog = ({ head, branches, mergeBranch, setMergeBranch, handleMerge, setShowMergeDialog }) => {
  const otherBranches = Object.keys(branches).filter(b => b !== head);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <GitMerge className="w-6 h-6 text-blue-400" />
            Merge Branch
          </h3>
          <button
            onClick={() => setShowMergeDialog(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select branch to merge into <span className="text-emerald-400 font-bold">{head}</span>
          </label>
          <select
            value={mergeBranch}
            onChange={(e) => setMergeBranch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select branch...</option>
            {otherBranches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-400">
            This will create a merge commit on <span className="text-emerald-400 font-semibold">{head}</span> branch
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowMergeDialog(false)}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={!mergeBranch}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Merge
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergeDialog;