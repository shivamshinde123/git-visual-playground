import React, { useRef } from 'react';
import { GitBranch, RotateCcw, Cloud } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import WorkingDirectory from './WorkingDirectory';
import StagingArea from './StagingArea';
import BranchOperations from './BranchOperations';
import RemoteOperations from './RemoteOperations';
import GitCanvas from './GitCanvas';
import RemotePanel from './RemotePanel';
import CommitDetailsPanel from './CommitDetailsPanel';
import AddFileDialog from './AddFileDialog';
import PullDialog from './PullDialog';
import MergeDialog from './MergeDialog';
import { useGitState } from '../hooks/useGitState';

const GitVisualPlayground = () => {
  const {
    commits, branches, head, workingDirectory, stagingArea, selectedCommit,
    commitMessage, setCommitMessage, newBranchName, setNewBranchName,
    remoteCommits, remoteBranches, remoteHead, remoteWorkingDirectory, remoteStagingArea,
    remoteCommitMessage, setRemoteCommitMessage, remoteNewBranchName, setRemoteNewBranchName,
    showRemotePanel, setShowRemotePanel, showMergeDialog, setShowMergeDialog, mergeBranch, setMergeBranch,
    showPullDialog, setShowPullDialog, pullBranch, setPullBranch,
    showAddFileDialog, setShowAddFileDialog, newFileName, setNewFileName,
    viewMode, setViewMode,
    addToStaging, removeFromStaging, handleCommit, handleMerge, createBranch,
    checkout, handlePush, handlePull, reset, handleAddFile, setSelectedCommit
  } = useGitState();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Top Control Panel */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Git Visual Playground</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('local')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'local' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Local
              </button>
              <button
                onClick={() => setViewMode('remote')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'remote' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Remote
              </button>
            </div>
            <button
              onClick={() => setShowRemotePanel(!showRemotePanel)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Cloud className="w-4 h-4" />
              Panel
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          <WorkingDirectory 
            workingDirectory={viewMode === 'local' ? workingDirectory : remoteWorkingDirectory}
            addToStaging={addToStaging}
            setShowAddFileDialog={setShowAddFileDialog}
          />
          
          <StagingArea 
            stagingArea={viewMode === 'local' ? stagingArea : remoteStagingArea}
            removeFromStaging={removeFromStaging}
            commitMessage={viewMode === 'local' ? commitMessage : remoteCommitMessage}
            setCommitMessage={viewMode === 'local' ? setCommitMessage : setRemoteCommitMessage}
            handleCommit={handleCommit}
          />
          
          <BranchOperations 
            branches={viewMode === 'local' ? branches : remoteBranches}
            head={viewMode === 'local' ? head : remoteHead}
            newBranchName={viewMode === 'local' ? newBranchName : remoteNewBranchName}
            setNewBranchName={viewMode === 'local' ? setNewBranchName : setRemoteNewBranchName}
            createBranch={createBranch}
            checkout={checkout}
            setShowMergeDialog={setShowMergeDialog}
          />
          
          <RemoteOperations 
            handlePush={handlePush}
            setShowPullDialog={setShowPullDialog}
            remoteBranches={remoteBranches}
          />
        </div>
      </div>
      
      <GitCanvas 
        ref={{ canvasRef, containerRef }}
        commits={viewMode === 'local' ? commits : remoteCommits}
        branches={viewMode === 'local' ? branches : remoteBranches}
        head={viewMode === 'local' ? head : 'main'}
        selectedCommit={selectedCommit}
        setSelectedCommit={setSelectedCommit}
        isRemoteView={viewMode === 'remote'}
      />
      
      {showRemotePanel && (
        <RemotePanel 
          remoteBranches={remoteBranches}
          remoteCommits={remoteCommits}
          setShowRemotePanel={setShowRemotePanel}
        />
      )}
      
      {selectedCommit && (
        <CommitDetailsPanel 
          selectedCommit={selectedCommit}
          commits={viewMode === 'local' ? commits : remoteCommits}
          setSelectedCommit={setSelectedCommit}
        />
      )}
      
      {showAddFileDialog && (
        <AddFileDialog 
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          handleAddFile={handleAddFile}
          setShowAddFileDialog={setShowAddFileDialog}
        />
      )}
      
      {showPullDialog && (
        <PullDialog 
          remoteBranches={remoteBranches}
          pullBranch={pullBranch}
          setPullBranch={setPullBranch}
          handlePull={handlePull}
          setShowPullDialog={setShowPullDialog}
        />
      )}
      
      {showMergeDialog && (
        <MergeDialog 
          head={head}
          branches={branches}
          mergeBranch={mergeBranch}
          setMergeBranch={setMergeBranch}
          handleMerge={handleMerge}
          setShowMergeDialog={setShowMergeDialog}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default GitVisualPlayground;