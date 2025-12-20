import { useState } from 'react';
import toast from 'react-hot-toast';

export const useGitState = () => {
  const [commits, setCommits] = useState([
    { id: 'commit-0', parentId: null, parents: [], message: 'Initial commit', timestamp: Date.now(), branch: 'main' }
  ]);
  const [branches, setBranches] = useState({ main: 'commit-0' });
  const [head, setHead] = useState('main');
  const [workingDirectory, setWorkingDirectory] = useState([
    { id: 'file-1', name: 'README.md', status: 'modified' },
    { id: 'file-2', name: 'index.js', status: 'modified' }
  ]);
  const [stagingArea, setStagingArea] = useState([]);
  const [commitCounter, setCommitCounter] = useState(1);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [mergeBranch, setMergeBranch] = useState('');
  const [showPullDialog, setShowPullDialog] = useState(false);
  const [pullBranch, setPullBranch] = useState('');
  const [showAddFileDialog, setShowAddFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [remoteCommits, setRemoteCommits] = useState([]);
  const [remoteBranches, setRemoteBranches] = useState({});
  const [remoteHead, setRemoteHead] = useState('main');
  const [remoteWorkingDirectory, setRemoteWorkingDirectory] = useState([]);
  const [remoteStagingArea, setRemoteStagingArea] = useState([]);
  const [remoteCommitMessage, setRemoteCommitMessage] = useState('');
  const [remoteNewBranchName, setRemoteNewBranchName] = useState('');
  const [remoteCommitCounter, setRemoteCommitCounter] = useState(1);
  const [showRemotePanel, setShowRemotePanel] = useState(false);
  const [viewMode, setViewMode] = useState('local');

  const addToStaging = (fileId) => {
    const isRemote = viewMode === 'remote';
    const workingDir = isRemote ? remoteWorkingDirectory : workingDirectory;
    const setWorkingDir = isRemote ? setRemoteWorkingDirectory : setWorkingDirectory;
    const setStagingAreaState = isRemote ? setRemoteStagingArea : setStagingArea;
    
    const file = workingDir.find(f => f.id === fileId);
    if (!file) return;
    setWorkingDir(prev => prev.filter(f => f.id !== fileId));
    setStagingAreaState(prev => [...prev, { ...file, status: 'staged' }]);
    toast.success(`Staged ${file.name} in ${isRemote ? 'remote' : 'local'}`);
  };

  const removeFromStaging = (fileId) => {
    const isRemote = viewMode === 'remote';
    const stagingAreaState = isRemote ? remoteStagingArea : stagingArea;
    const setStagingAreaState = isRemote ? setRemoteStagingArea : setStagingArea;
    const setWorkingDir = isRemote ? setRemoteWorkingDirectory : setWorkingDirectory;
    
    const file = stagingAreaState.find(f => f.id === fileId);
    if (!file) return;
    setStagingAreaState(prev => prev.filter(f => f.id !== fileId));
    setWorkingDir(prev => [...prev, { ...file, status: 'modified' }]);
    toast.success(`Unstaged ${file.name} in ${isRemote ? 'remote' : 'local'}`);
  };

  const handleCommit = () => {
    const isRemote = viewMode === 'remote';
    const stagingAreaState = isRemote ? remoteStagingArea : stagingArea;
    const commitMsg = isRemote ? remoteCommitMessage : commitMessage;
    const branchesState = isRemote ? remoteBranches : branches;
    const headState = isRemote ? remoteHead : head;
    const counter = isRemote ? remoteCommitCounter : commitCounter;
    
    if (stagingAreaState.length === 0 || !commitMsg.trim()) return;
    
    const currentCommitId = branchesState[headState];
    const newCommitId = `${isRemote ? 'remote-' : ''}commit-${counter}`;
    const newCommit = {
      id: newCommitId,
      parentId: currentCommitId,
      parents: currentCommitId ? [currentCommitId] : [],
      message: commitMsg.trim(),
      timestamp: Date.now(),
      branch: headState
    };
    
    if (isRemote) {
      setRemoteCommits(prev => [...prev, newCommit]);
      setRemoteBranches(prev => ({ ...prev, [headState]: newCommitId }));
      setRemoteStagingArea([]);
      setRemoteCommitCounter(prev => prev + 1);
      setRemoteCommitMessage('');
    } else {
      setCommits(prev => [...prev, newCommit]);
      setBranches(prev => ({ ...prev, [headState]: newCommitId }));
      setStagingArea([]);
      setCommitCounter(prev => prev + 1);
      setCommitMessage('');
    }
    toast.success(`Committed "${commitMsg.trim()}" to ${isRemote ? 'remote' : 'local'}`);
  };

  const handleMerge = () => {
    if (!mergeBranch || mergeBranch === head) {
      setShowMergeDialog(false);
      return;
    }
    
    const currentCommitId = branches[head];
    const mergeCommitId = branches[mergeBranch];
    
    if (!mergeCommitId) {
      setShowMergeDialog(false);
      return;
    }
    
    const newCommitId = `commit-${commitCounter}`;
    const newCommit = {
      id: newCommitId,
      parentId: currentCommitId,
      parents: [currentCommitId, mergeCommitId],
      message: `Merge branch '${mergeBranch}' into ${head}`,
      timestamp: Date.now(),
      branch: head,
      isMerge: true
    };
    
    setCommits(prev => [...prev, newCommit]);
    setBranches(prev => ({ ...prev, [head]: newCommitId }));
    setCommitCounter(prev => prev + 1);
    setShowMergeDialog(false);
    setMergeBranch('');
  };

  const createBranch = () => {
    const isRemote = viewMode === 'remote';
    const branchName = isRemote ? remoteNewBranchName : newBranchName;
    const branchesState = isRemote ? remoteBranches : branches;
    const headState = isRemote ? remoteHead : head;
    
    if (!branchName.trim() || branchesState[branchName.trim()]) return;
    const currentCommitId = branchesState[headState];
    
    if (isRemote) {
      setRemoteBranches(prev => ({ ...prev, [branchName.trim()]: currentCommitId }));
      setRemoteNewBranchName('');
    } else {
      setBranches(prev => ({ ...prev, [branchName.trim()]: currentCommitId }));
      setNewBranchName('');
    }
  };

  const checkout = (branchName) => {
    const isRemote = viewMode === 'remote';
    const branchesState = isRemote ? remoteBranches : branches;
    
    if (!branchesState[branchName]) return;
    
    if (isRemote) {
      setRemoteHead(branchName);
    } else {
      setHead(branchName);
    }
  };

  const handlePush = () => {
    let totalPushedCommits = 0;
    const allCommitsToAdd = new Set();
    const branchesToUpdate = {};
    
    // Process all local branches
    Object.entries(branches).forEach(([branchName, localCommitId]) => {
      const commitsToCheck = new Set();
      const queue = [localCommitId];
      
      while (queue.length > 0) {
        const commitId = queue.shift();
        if (commitsToCheck.has(commitId)) continue;
        commitsToCheck.add(commitId);
        
        const commit = commits.find(c => c.id === commitId);
        if (commit && commit.parentId && !remoteCommits.find(rc => rc.id === commit.parentId)) {
          queue.push(commit.parentId);
        }
        if (commit && commit.parents) {
          commit.parents.forEach(p => {
            if (!remoteCommits.find(rc => rc.id === p)) {
              queue.push(p);
            }
          });
        }
      }
      
      // Add commits that don't exist remotely
      const newCommitsForBranch = commits.filter(c => 
        commitsToCheck.has(c.id) && !remoteCommits.find(rc => rc.id === c.id)
      );
      
      newCommitsForBranch.forEach(commit => allCommitsToAdd.add(commit));
      totalPushedCommits += newCommitsForBranch.length;
      
      // Update branch pointer
      branchesToUpdate[branchName] = localCommitId;
    });
    
    if (totalPushedCommits > 0) {
      setRemoteCommits(prev => [...prev, ...Array.from(allCommitsToAdd)]);
      setRemoteBranches(prev => ({ ...prev, ...branchesToUpdate }));
      toast.success(`Pushed ${totalPushedCommits} commit(s) from ${Object.keys(branchesToUpdate).length} branch(es)`);
    } else {
      toast.info('Already up to date');
    }
  };

  const handlePull = () => {
    if (!pullBranch) {
      setShowPullDialog(false);
      return;
    }
    
    const remoteCommitId = remoteBranches[pullBranch];
    if (!remoteCommitId) {
      setShowPullDialog(false);
      return;
    }
    
    const commitsToCheck = new Set();
    const queue = [remoteCommitId];
    
    while (queue.length > 0) {
      const commitId = queue.shift();
      if (commitsToCheck.has(commitId)) continue;
      commitsToCheck.add(commitId);
      
      const commit = remoteCommits.find(c => c.id === commitId);
      if (commit && commit.parentId && !commits.find(lc => lc.id === commit.parentId)) {
        queue.push(commit.parentId);
      }
      if (commit && commit.parents) {
        commit.parents.forEach(p => {
          if (!commits.find(lc => lc.id === p)) {
            queue.push(p);
          }
        });
      }
    }
    
    const newLocalCommits = remoteCommits.filter(c => commitsToCheck.has(c.id) && !commits.find(lc => lc.id === c.id));
    
    if (newLocalCommits.length > 0) {
      setCommits(prev => [...prev, ...newLocalCommits]);
      setBranches(prev => ({ ...prev, [pullBranch]: remoteCommitId }));
      toast.success(`Pulled ${newLocalCommits.length} commit(s) from ${pullBranch}`);
    } else {
      toast.info(`${pullBranch} is already up to date`);
    }
    
    setShowPullDialog(false);
    setPullBranch('');
  };

  const reset = () => {
    const initialCommit = { id: 'commit-0', parentId: null, parents: [], message: 'Initial commit', timestamp: Date.now(), branch: 'main' };
    setCommits([initialCommit]);
    setBranches({ main: 'commit-0' });
    setHead('main');
    setWorkingDirectory([
      { id: 'file-1', name: 'README.md', status: 'modified' },
      { id: 'file-2', name: 'index.js', status: 'modified' }
    ]);
    setStagingArea([]);
    setCommitCounter(1);
    setSelectedCommit(null);
    setRemoteCommits([]);
    setRemoteBranches({});
    setRemoteHead('main');
    setRemoteWorkingDirectory([]);
    setRemoteStagingArea([]);
    setRemoteCommitCounter(1);
    toast.success('Reset to initial state');
  };

  const handleAddFile = () => {
    const isRemote = viewMode === 'remote';
    const fileName = newFileName;
    
    if (!fileName.trim()) return;
    const fileId = `${isRemote ? 'remote-' : ''}file-${Date.now()}`;
    const newFile = { id: fileId, name: fileName.trim(), status: 'modified' };
    
    if (isRemote) {
      setRemoteWorkingDirectory(prev => [...prev, newFile]);
    } else {
      setWorkingDirectory(prev => [...prev, newFile]);
    }
    
    setNewFileName('');
    setShowAddFileDialog(false);
    toast.success(`Added ${fileName.trim()} to ${isRemote ? 'remote' : 'local'}`);
  };

  return {
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
  };
};