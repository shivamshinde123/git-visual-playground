import React from 'react';
import { GitBranch, Plus, GitMerge } from 'lucide-react';

const BranchOperations = ({ 
  branches, head, newBranchName, setNewBranchName, 
  createBranch, checkout, setShowMergeDialog 
}) => {
  const getBranchStyle = (branchName) => {
    const styles = {
      main: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
      develop: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700' },
      feature: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600' },
    };
    return styles[branchName] || { bg: 'bg-pink-600', hover: 'hover:bg-pink-700' };
  };

  const otherBranches = Object.keys(branches).filter(b => b !== head);

  return (
    <div className="col-span-4 bg-gray-750 border border-gray-600 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-gray-200">Branch Operations</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.keys(branches).map((branchName) => {
          const style = getBranchStyle(branchName);
          const isActive = head === branchName;
          
          return (
            <button
              key={branchName}
              onClick={() => checkout(branchName)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? `${style.bg} text-white ring-2 ring-emerald-400`
                  : `bg-gray-700 text-gray-300 ${style.hover}`
              }`}
            >
              {branchName}
            </button>
          );
        })}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex gap-1">
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="new-branch"
            className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
            onKeyDown={(e) => e.key === 'Enter' && createBranch()}
          />
          <button
            onClick={createBranch}
            className="p-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            title="Create Branch"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={() => setShowMergeDialog(true)}
          disabled={otherBranches.length === 0}
          className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          <GitMerge className="w-3 h-3" />
          Merge Into {head}
        </button>
      </div>
    </div>
  );
};

export default BranchOperations;