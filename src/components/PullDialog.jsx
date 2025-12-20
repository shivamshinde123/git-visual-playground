import React from 'react';
import { Download, X } from 'lucide-react';

const PullDialog = ({ remoteBranches, pullBranch, setPullBranch, handlePull, setShowPullDialog }) => {
  const remoteBranchNames = Object.keys(remoteBranches);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-green-400" />
            Pull Branch
          </h3>
          <button
            onClick={() => setShowPullDialog(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select branch to pull from remote
          </label>
          <select
            value={pullBranch}
            onChange={(e) => setPullBranch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-green-500"
          >
            <option value="">Select branch...</option>
            {remoteBranchNames.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-400">
            This will pull commits from the selected remote branch
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowPullDialog(false)}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePull}
            disabled={!pullBranch}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Pull
          </button>
        </div>
      </div>
    </div>
  );
};

export default PullDialog;