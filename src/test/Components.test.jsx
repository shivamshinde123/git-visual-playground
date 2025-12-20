import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import WorkingDirectory from '../components/WorkingDirectory'
import StagingArea from '../components/StagingArea'
import BranchOperations from '../components/BranchOperations'
import RemoteOperations from '../components/RemoteOperations'

describe('Component Tests', () => {
  describe('WorkingDirectory Component', () => {
    const mockProps = {
      workingDirectory: [
        { id: 'file-1', name: 'test.js', status: 'modified' },
        { id: 'file-2', name: 'README.md', status: 'modified' }
      ],
      addToStaging: vi.fn(),
      setShowAddFileDialog: vi.fn()
    }

    it('should display working directory files', () => {
      render(<WorkingDirectory {...mockProps} />)
      
      expect(screen.getByText('test.js')).toBeInTheDocument()
      expect(screen.getByText('README.md')).toBeInTheDocument()
    })

    it('should show "No changes" when empty', () => {
      render(<WorkingDirectory {...mockProps} workingDirectory={[]} />)
      
      expect(screen.getByText('No changes')).toBeInTheDocument()
    })

    it('should call addToStaging when stage button clicked', async () => {
      const user = userEvent.setup()
      render(<WorkingDirectory {...mockProps} />)
      
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      expect(mockProps.addToStaging).toHaveBeenCalledWith('file-1')
    })

    it('should open add file dialog when Add File clicked', async () => {
      const user = userEvent.setup()
      render(<WorkingDirectory {...mockProps} />)
      
      await user.click(screen.getByText('Add File'))
      
      expect(mockProps.setShowAddFileDialog).toHaveBeenCalledWith(true)
    })
  })

  describe('StagingArea Component', () => {
    const mockProps = {
      stagingArea: [
        { id: 'file-1', name: 'test.js', status: 'staged' }
      ],
      removeFromStaging: vi.fn(),
      commitMessage: 'Test commit',
      setCommitMessage: vi.fn(),
      handleCommit: vi.fn()
    }

    it('should display staged files', () => {
      render(<StagingArea {...mockProps} />)
      
      expect(screen.getByText('test.js')).toBeInTheDocument()
    })

    it('should show "No staged changes" when empty', () => {
      render(<StagingArea {...mockProps} stagingArea={[]} />)
      
      expect(screen.getByText('No staged changes')).toBeInTheDocument()
    })

    it('should call removeFromStaging when unstage button clicked', async () => {
      const user = userEvent.setup()
      render(<StagingArea {...mockProps} />)
      
      const unstageButton = screen.getByTitle('Unstage')
      await user.click(unstageButton)
      
      expect(mockProps.removeFromStaging).toHaveBeenCalledWith('file-1')
    })

    it('should disable commit button when no staged files', () => {
      render(<StagingArea {...mockProps} stagingArea={[]} />)
      
      const commitButton = screen.getByText('Commit')
      expect(commitButton).toBeDisabled()
    })

    it('should disable commit button when no message', () => {
      render(<StagingArea {...mockProps} commitMessage="" />)
      
      const commitButton = screen.getByText('Commit')
      expect(commitButton).toBeDisabled()
    })

    it('should call handleCommit when commit button clicked', async () => {
      const user = userEvent.setup()
      render(<StagingArea {...mockProps} />)
      
      await user.click(screen.getByText('Commit'))
      
      expect(mockProps.handleCommit).toHaveBeenCalled()
    })

    it('should commit on Enter key press', async () => {
      const user = userEvent.setup()
      render(<StagingArea {...mockProps} />)
      
      const input = screen.getByPlaceholderText('Commit message')
      await user.type(input, '{enter}')
      
      expect(mockProps.handleCommit).toHaveBeenCalled()
    })
  })

  describe('BranchOperations Component', () => {
    const mockProps = {
      branches: { main: 'commit-0', feature: 'commit-1' },
      head: 'main',
      newBranchName: '',
      setNewBranchName: vi.fn(),
      createBranch: vi.fn(),
      checkout: vi.fn(),
      setShowMergeDialog: vi.fn()
    }

    it('should display all branches', () => {
      render(<BranchOperations {...mockProps} />)
      
      expect(screen.getByText('main')).toBeInTheDocument()
      expect(screen.getByText('feature')).toBeInTheDocument()
    })

    it('should highlight active branch', () => {
      render(<BranchOperations {...mockProps} />)
      
      const mainButton = screen.getByText('main')
      expect(mainButton).toHaveClass('ring-2')
    })

    it('should call checkout when branch clicked', async () => {
      const user = userEvent.setup()
      render(<BranchOperations {...mockProps} />)
      
      await user.click(screen.getByText('feature'))
      
      expect(mockProps.checkout).toHaveBeenCalledWith('feature')
    })

    it('should call createBranch when create button clicked', async () => {
      const user = userEvent.setup()
      render(<BranchOperations {...mockProps} />)
      
      await user.click(screen.getByTitle('Create Branch'))
      
      expect(mockProps.createBranch).toHaveBeenCalled()
    })

    it('should create branch on Enter key press', async () => {
      const user = userEvent.setup()
      render(<BranchOperations {...mockProps} />)
      
      const input = screen.getByPlaceholderText('new-branch')
      await user.type(input, '{enter}')
      
      expect(mockProps.createBranch).toHaveBeenCalled()
    })

    it('should disable merge when no other branches', () => {
      render(<BranchOperations {...mockProps} branches={{ main: 'commit-0' }} />)
      
      const mergeButton = screen.getByText(/Merge Into/)
      expect(mergeButton).toBeDisabled()
    })

    it('should open merge dialog when merge clicked', async () => {
      const user = userEvent.setup()
      render(<BranchOperations {...mockProps} />)
      
      await user.click(screen.getByText(/Merge Into/))
      
      expect(mockProps.setShowMergeDialog).toHaveBeenCalledWith(true)
    })
  })

  describe('RemoteOperations Component', () => {
    const mockProps = {
      handlePush: vi.fn(),
      setShowPullDialog: vi.fn(),
      remoteBranches: { main: 'remote-commit-0' }
    }

    it('should call handlePush when push clicked', async () => {
      const user = userEvent.setup()
      render(<RemoteOperations {...mockProps} />)
      
      await user.click(screen.getByText('Push'))
      
      expect(mockProps.handlePush).toHaveBeenCalled()
    })

    it('should open pull dialog when pull clicked', async () => {
      const user = userEvent.setup()
      render(<RemoteOperations {...mockProps} />)
      
      await user.click(screen.getByText('Pull'))
      
      expect(mockProps.setShowPullDialog).toHaveBeenCalledWith(true)
    })

    it('should disable pull when no remote branches', () => {
      render(<RemoteOperations {...mockProps} remoteBranches={{}} />)
      
      const pullButton = screen.getByText('Pull')
      expect(pullButton).toBeDisabled()
    })

    it('should enable pull when remote branches exist', () => {
      render(<RemoteOperations {...mockProps} />)
      
      const pullButton = screen.getByText('Pull')
      expect(pullButton).not.toBeDisabled()
    })
  })
})