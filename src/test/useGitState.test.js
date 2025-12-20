import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGitState } from '../hooks/useGitState'
import toast from 'react-hot-toast'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe('useGitState Hook', () => {
  let result

  beforeEach(() => {
    vi.clearAllMocks()
    const { result: hookResult } = renderHook(() => useGitState())
    result = hookResult
  })

  describe('Initial State', () => {
    it('should initialize with correct local state', () => {
      expect(result.current.commits).toHaveLength(1)
      expect(result.current.commits[0].message).toBe('Initial commit')
      expect(result.current.branches).toEqual({ main: 'commit-0' })
      expect(result.current.head).toBe('main')
      expect(result.current.workingDirectory).toHaveLength(2)
      expect(result.current.stagingArea).toHaveLength(0)
    })

    it('should initialize with empty remote state', () => {
      expect(result.current.remoteCommits).toHaveLength(0)
      expect(result.current.remoteBranches).toEqual({})
      expect(result.current.remoteWorkingDirectory).toHaveLength(0)
      expect(result.current.remoteStagingArea).toHaveLength(0)
    })

    it('should start in local view mode', () => {
      expect(result.current.viewMode).toBe('local')
    })
  })

  describe('File Operations', () => {
    it('should add file to staging area', () => {
      const fileId = result.current.workingDirectory[0].id

      act(() => {
        result.current.addToStaging(fileId)
      })

      expect(result.current.stagingArea).toHaveLength(1)
      expect(result.current.workingDirectory).toHaveLength(1)
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Staged'))
    })

    it('should remove file from staging area', () => {
      const fileId = result.current.workingDirectory[0].id

      act(() => {
        result.current.addToStaging(fileId)
      })

      act(() => {
        result.current.removeFromStaging(fileId)
      })

      expect(result.current.stagingArea).toHaveLength(0)
      expect(result.current.workingDirectory).toHaveLength(2)
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Unstaged'))
    })

    it('should add new file to working directory', () => {
      act(() => {
        result.current.setNewFileName('test.js')
      })

      act(() => {
        result.current.handleAddFile()
      })

      expect(result.current.workingDirectory).toHaveLength(3)
      expect(result.current.newFileName).toBe('')
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Added test.js'))
    })
  })

  describe('Commit Operations', () => {
    it('should create commit with staged files', () => {
      const fileId = result.current.workingDirectory[0].id

      act(() => {
        result.current.addToStaging(fileId)
        result.current.setCommitMessage('Test commit')
      })

      act(() => {
        result.current.handleCommit()
      })

      expect(result.current.commits).toHaveLength(2)
      expect(result.current.commits[1].message).toBe('Test commit')
      expect(result.current.stagingArea).toHaveLength(0)
      expect(result.current.commitMessage).toBe('')
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Committed'))
    })

    it('should not commit without staged files', () => {
      act(() => {
        result.current.setCommitMessage('Test commit')
        result.current.handleCommit()
      })

      expect(result.current.commits).toHaveLength(1)
      expect(toast.success).not.toHaveBeenCalled()
    })

    it('should not commit without message', () => {
      const fileId = result.current.workingDirectory[0].id

      act(() => {
        result.current.addToStaging(fileId)
        result.current.setCommitMessage('')
        result.current.handleCommit()
      })

      expect(result.current.commits).toHaveLength(1)
      expect(toast.success).not.toHaveBeenCalledWith(expect.stringContaining('Committed'))
    })
  })

  describe('Branch Operations', () => {
    it('should create new branch', () => {
      act(() => {
        result.current.setNewBranchName('feature')
      })
      
      act(() => {
        result.current.createBranch()
      })

      expect(result.current.branches).toHaveProperty('feature')
      expect(result.current.branches.feature).toBe('commit-0')
      expect(result.current.newBranchName).toBe('')
    })

    it('should checkout to different branch', () => {
      act(() => {
        result.current.setNewBranchName('feature')
      })
      
      act(() => {
        result.current.createBranch()
      })

      act(() => {
        result.current.checkout('feature')
      })

      expect(result.current.head).toBe('feature')
    })

    it('should not create branch with empty name', () => {
      act(() => {
        result.current.createBranch()
      })

      expect(Object.keys(result.current.branches)).toHaveLength(1)
    })
  })

  describe('Remote Operations', () => {
    it('should push commits to remote', () => {
      // Create a commit first
      const fileId = result.current.workingDirectory[0].id

      act(() => {
        result.current.addToStaging(fileId)
      })
      
      act(() => {
        result.current.setCommitMessage('Test commit')
      })
      
      act(() => {
        result.current.handleCommit()
      })

      act(() => {
        result.current.handlePush()
      })

      expect(result.current.remoteCommits.length).toBeGreaterThan(0)
      expect(result.current.remoteBranches).toHaveProperty('main')
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Pushed'))
    })

    it('should handle pull with no remote branches', () => {
      act(() => {
        result.current.setPullBranch('main')
        result.current.handlePull()
      })

      expect(toast.info).not.toHaveBeenCalled()
    })
  })

  describe('View Mode Operations', () => {
    it('should switch view modes', () => {
      act(() => {
        result.current.setViewMode('remote')
      })

      expect(result.current.viewMode).toBe('remote')
    })

    it('should handle file operations in remote view', () => {
      act(() => {
        result.current.setViewMode('remote')
      })
      
      act(() => {
        result.current.setNewFileName('remote-file.js')
      })
      
      act(() => {
        result.current.handleAddFile()
      })

      expect(result.current.remoteWorkingDirectory).toHaveLength(1)
      expect(result.current.workingDirectory).toHaveLength(2) // Local unchanged
    })

    it('should handle commits in remote view', () => {
      act(() => {
        result.current.setViewMode('remote')
      })
      
      act(() => {
        result.current.setNewFileName('remote-file.js')
      })
      
      act(() => {
        result.current.handleAddFile()
      })

      const fileId = result.current.remoteWorkingDirectory[0].id

      act(() => {
        result.current.addToStaging(fileId)
      })
      
      act(() => {
        result.current.setRemoteCommitMessage('Remote commit')
      })
      
      act(() => {
        result.current.handleCommit()
      })

      expect(result.current.remoteCommits).toHaveLength(1)
      expect(result.current.commits).toHaveLength(1) // Local unchanged
    })
  })

  describe('Reset Functionality', () => {
    it('should reset to initial state', () => {
      // Make some changes first
      const fileId = result.current.workingDirectory[0].id

      act(() => {
        result.current.addToStaging(fileId)
        result.current.setCommitMessage('Test commit')
        result.current.handleCommit()
        result.current.setNewBranchName('feature')
        result.current.createBranch()
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.commits).toHaveLength(1)
      expect(result.current.branches).toEqual({ main: 'commit-0' })
      expect(result.current.head).toBe('main')
      expect(result.current.workingDirectory).toHaveLength(2)
      expect(result.current.stagingArea).toHaveLength(0)
      expect(result.current.remoteCommits).toHaveLength(0)
      expect(result.current.remoteBranches).toEqual({})
      expect(toast.success).toHaveBeenCalledWith('Reset to initial state')
    })
  })

  describe('Edge Cases', () => {
    it('should handle staging non-existent file', () => {
      act(() => {
        result.current.addToStaging('non-existent-id')
      })

      expect(result.current.stagingArea).toHaveLength(0)
    })

    it('should handle unstaging non-existent file', () => {
      act(() => {
        result.current.removeFromStaging('non-existent-id')
      })

      expect(result.current.workingDirectory).toHaveLength(2)
    })

    it('should handle checkout to non-existent branch', () => {
      const originalHead = result.current.head

      act(() => {
        result.current.checkout('non-existent-branch')
      })

      expect(result.current.head).toBe(originalHead)
    })

    it('should handle duplicate branch creation', () => {
      act(() => {
        result.current.setNewBranchName('main')
        result.current.createBranch()
      })

      expect(Object.keys(result.current.branches)).toHaveLength(1)
    })
  })
})