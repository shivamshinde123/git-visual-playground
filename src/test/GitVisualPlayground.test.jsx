import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import GitVisualPlayground from '../components/GitVisualPlayground'

// Mock canvas context
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    clearRect: vi.fn(),
    strokeStyle: '',
    lineWidth: 0,
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fillStyle: '',
    fill: vi.fn(),
    font: '',
    textAlign: '',
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 50 })),
    fillRect: vi.fn(),
    bezierCurveTo: vi.fn(),
    setLineDash: vi.fn(),
    scale: vi.fn()
  })
})

// Mock toast to avoid issues in tests
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}))

describe('Git Visual Playground', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
  })

  // T1: Initial State Tests
  describe('Initial State', () => {
    it('T1.1: App loads with local view showing initial commit', () => {
      render(<GitVisualPlayground />)
      expect(screen.getByText('Git Visual Playground')).toBeInTheDocument()
      expect(screen.getByText('Local')).toHaveClass('bg-emerald-600')
    })

    it('T1.2: Remote view is completely empty initially', async () => {
      render(<GitVisualPlayground />)
      await user.click(screen.getByText('Remote'))
      expect(screen.getByText('No changes')).toBeInTheDocument()
      expect(screen.getByText('No staged changes')).toBeInTheDocument()
    })

    it('T1.3: Local has 2 sample files in working directory', () => {
      render(<GitVisualPlayground />)
      expect(screen.getByText('README.md')).toBeInTheDocument()
      expect(screen.getByText('index.js')).toBeInTheDocument()
    })

    it('T1.4: Staging area is empty in both views', async () => {
      render(<GitVisualPlayground />)
      expect(screen.getByText('No staged changes')).toBeInTheDocument()
      
      await user.click(screen.getByText('Remote'))
      expect(screen.getByText('No staged changes')).toBeInTheDocument()
    })
  })

  // T2: File Management Tests
  describe('File Management', () => {
    it('T2.1: Add new file to local working directory', async () => {
      render(<GitVisualPlayground />)
      await user.click(screen.getByText('Add File'))
      
      const input = screen.getByPlaceholderText('example.txt')
      await user.type(input, 'test.js')
      await user.click(screen.getByText('Add File'))
      
      expect(screen.getByText('test.js')).toBeInTheDocument()
    })

    it('T2.2: Stage file from working directory to staging area', async () => {
      render(<GitVisualPlayground />)
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      expect(screen.getByText('README.md')).toBeInTheDocument()
    })

    it('T2.3: Unstage file from staging area back to working directory', async () => {
      render(<GitVisualPlayground />)
      // First stage a file
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      // Then unstage it
      const unstageButton = screen.getByTitle('Unstage')
      await user.click(unstageButton)
      
      expect(screen.getByText('README.md')).toBeInTheDocument()
    })

    it('T2.5: Add file with special characters in name', async () => {
      render(<GitVisualPlayground />)
      await user.click(screen.getByText('Add File'))
      
      const input = screen.getByPlaceholderText('example.txt')
      await user.type(input, 'test-file_123.js')
      await user.click(screen.getByText('Add File'))
      
      expect(screen.getByText('test-file_123.js')).toBeInTheDocument()
    })

    it('T2.6: Add file with empty name should disable submit', async () => {
      render(<GitVisualPlayground />)
      await user.click(screen.getByText('Add File'))
      
      const submitButton = screen.getByRole('button', { name: 'Add File' })
      expect(submitButton).toBeDisabled()
    })
  })

  // T3: Commit Tests
  describe('Commit Operations', () => {
    it('T3.1: Commit with staged files and message', async () => {
      render(<GitVisualPlayground />)
      
      // Stage a file
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      // Add commit message
      const messageInput = screen.getByPlaceholderText('Commit message')
      await user.type(messageInput, 'Test commit')
      
      // Commit
      await user.click(screen.getByText('Commit'))
      
      expect(messageInput.value).toBe('')
    })

    it('T3.2: Commit without staged files should be disabled', () => {
      render(<GitVisualPlayground />)
      const commitButton = screen.getByText('Commit')
      expect(commitButton).toBeDisabled()
    })

    it('T3.3: Commit without message should be disabled', async () => {
      render(<GitVisualPlayground />)
      
      // Stage a file
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      const commitButton = screen.getByText('Commit')
      expect(commitButton).toBeDisabled()
    })
  })

  // T4: Branch Operations Tests
  describe('Branch Operations', () => {
    it('T4.1: Create new branch from current commit', async () => {
      render(<GitVisualPlayground />)
      
      const branchInput = screen.getByPlaceholderText('new-branch')
      await user.type(branchInput, 'feature-test')
      
      const createButton = screen.getByTitle('Create Branch')
      await user.click(createButton)
      
      expect(screen.getByText('feature-test')).toBeInTheDocument()
    })

    it('T4.2: Switch between branches (checkout)', async () => {
      render(<GitVisualPlayground />)
      
      // Create a branch first
      const branchInput = screen.getByPlaceholderText('new-branch')
      await user.type(branchInput, 'test-branch')
      await user.click(screen.getByTitle('Create Branch'))
      
      // Switch to the new branch
      await user.click(screen.getByText('test-branch'))
      
      expect(screen.getByText('test-branch')).toHaveClass('ring-2')
    })

    it('T4.3: Branch creation with empty name should not work', async () => {
      render(<GitVisualPlayground />)
      
      const createButton = screen.getByTitle('Create Branch')
      await user.click(createButton)
      
      // Should still only have main branch
      expect(screen.queryByText('feature-test')).not.toBeInTheDocument()
    })
  })

  // T5: Merge Operations Tests
  describe('Merge Operations', () => {
    it('T5.1: Merge dialog opens when clicking merge', async () => {
      render(<GitVisualPlayground />)
      
      // Create a branch first
      const branchInput = screen.getByPlaceholderText('new-branch')
      await user.type(branchInput, 'feature')
      await user.click(screen.getByTitle('Create Branch'))
      
      // Open merge dialog
      await user.click(screen.getByText(/Merge Into/))
      
      expect(screen.getByText('Merge Branch')).toBeInTheDocument()
    })

    it('T5.4: Merge with no other branches should be disabled', () => {
      render(<GitVisualPlayground />)
      
      const mergeButton = screen.getByText(/Merge Into/)
      expect(mergeButton).toBeDisabled()
    })
  })

  // T6: Push/Pull Tests
  describe('Push/Pull Operations', () => {
    it('T6.1: Push button is always enabled', () => {
      render(<GitVisualPlayground />)
      
      const pushButton = screen.getByText('Push')
      expect(pushButton).not.toBeDisabled()
    })

    it('T6.7: Pull dialog opens when clicking pull', async () => {
      render(<GitVisualPlayground />)
      
      // Switch to remote and create some content
      await user.click(screen.getByText('Remote'))
      await user.click(screen.getByText('Add File'))
      
      const input = screen.getByPlaceholderText('example.txt')
      await user.type(input, 'remote-file.js')
      await user.click(screen.getByText('Add File'))
      
      // Stage and commit
      const stageButton = screen.getByTitle('Git Add')
      await user.click(stageButton)
      
      const messageInput = screen.getByPlaceholderText('Commit message')
      await user.type(messageInput, 'Remote commit')
      await user.click(screen.getByText('Commit'))
      
      // Switch back to local
      await user.click(screen.getByText('Local'))
      
      // Try to pull
      await user.click(screen.getByText('Pull'))
      
      expect(screen.getByText('Pull Branch')).toBeInTheDocument()
    })
  })

  // T7: View Switching Tests
  describe('View Switching', () => {
    it('T7.1: Switch from local to remote view', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Remote'))
      
      expect(screen.getByText('Remote')).toHaveClass('bg-blue-600')
      expect(screen.getByText('Local')).not.toHaveClass('bg-emerald-600')
    })

    it('T7.2: Switch from remote to local view', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Remote'))
      await user.click(screen.getByText('Local'))
      
      expect(screen.getByText('Local')).toHaveClass('bg-emerald-600')
      expect(screen.getByText('Remote')).not.toHaveClass('bg-blue-600')
    })

    it('T7.5: Working directory shows correct files per view', async () => {
      render(<GitVisualPlayground />)
      
      // Local should have sample files
      expect(screen.getByText('README.md')).toBeInTheDocument()
      
      // Remote should be empty
      await user.click(screen.getByText('Remote'))
      expect(screen.getByText('No changes')).toBeInTheDocument()
    })
  })

  // T9: Dialog Tests
  describe('Dialog Interactions', () => {
    it('T9.1: Add File dialog opens when clicking Add File', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Add File'))
      
      expect(screen.getByText('Add New File')).toBeInTheDocument()
    })

    it('T9.2: Add File dialog closes on cancel', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Add File'))
      await user.click(screen.getByText('Cancel'))
      
      expect(screen.queryByText('Add New File')).not.toBeInTheDocument()
    })

    it('T9.4: Enter key submits add file form', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Add File'))
      const input = screen.getByPlaceholderText('example.txt')
      await user.type(input, 'test.js{enter}')
      
      expect(screen.queryByText('Add New File')).not.toBeInTheDocument()
      expect(screen.getByText('test.js')).toBeInTheDocument()
    })

    it('T9.17: Remote panel opens/closes correctly', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Panel'))
      expect(screen.getByText('Remote Repository')).toBeInTheDocument()
      
      const closeButton = screen.getByRole('button', { name: '' }) // X button
      await user.click(closeButton)
      expect(screen.queryByText('Remote Repository')).not.toBeInTheDocument()
    })
  })

  // T11: Reset Functionality Tests
  describe('Reset Functionality', () => {
    it('T11.1: Reset clears all commits except initial', async () => {
      render(<GitVisualPlayground />)
      
      // Make a commit first
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      const messageInput = screen.getByPlaceholderText('Commit message')
      await user.type(messageInput, 'Test commit')
      await user.click(screen.getByText('Commit'))
      
      // Reset
      await user.click(screen.getByText('Reset'))
      
      // Should be back to initial state
      expect(screen.getByText('README.md')).toBeInTheDocument()
      expect(screen.getByText('index.js')).toBeInTheDocument()
    })

    it('T11.2: Reset clears all remote data', async () => {
      render(<GitVisualPlayground />)
      
      // Switch to remote and add content
      await user.click(screen.getByText('Remote'))
      await user.click(screen.getByText('Add File'))
      
      const input = screen.getByPlaceholderText('example.txt')
      await user.type(input, 'remote-file.js')
      await user.click(screen.getByText('Add File'))
      
      // Reset
      await user.click(screen.getByText('Reset'))
      
      // Remote should be empty
      await user.click(screen.getByText('Remote'))
      expect(screen.getByText('No changes')).toBeInTheDocument()
    })

    it('T11.6: Reset switches to local view', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Remote'))
      await user.click(screen.getByText('Reset'))
      
      expect(screen.getByText('Local')).toHaveClass('bg-emerald-600')
    })
  })

  // T12: Edge Cases and Error Handling
  describe('Edge Cases', () => {
    it('T12.6: Very long commit messages display correctly', async () => {
      render(<GitVisualPlayground />)
      
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      const longMessage = 'This is a very long commit message that should still work properly even though it contains many characters and might cause display issues'
      const messageInput = screen.getByPlaceholderText('Commit message')
      await user.type(messageInput, longMessage)
      
      expect(messageInput.value).toBe(longMessage)
    })

    it('T12.7: Very long file names display correctly', async () => {
      render(<GitVisualPlayground />)
      
      await user.click(screen.getByText('Add File'))
      const longFileName = 'this-is-a-very-long-file-name-that-might-cause-display-issues.js'
      
      const input = screen.getByPlaceholderText('example.txt')
      await user.type(input, longFileName)
      await user.click(screen.getByText('Add File'))
      
      expect(screen.getByText(longFileName)).toBeInTheDocument()
    })
  })

  // T13: Complex Workflow Tests
  describe('Complex Workflows', () => {
    it('T13.1: Standard Git workflow: Add → Stage → Commit → Push → Verify', async () => {
      render(<GitVisualPlayground />)
      
      // Add file
      await user.click(screen.getByText('Add File'))
      const input = screen.getByPlaceholderText('example.txt')
      await user.type(input, 'workflow-test.js')
      await user.click(screen.getByText('Add File'))
      
      // Stage file
      const stageButton = screen.getByTitle('Git Add')
      await user.click(stageButton)
      
      // Commit
      const messageInput = screen.getByPlaceholderText('Commit message')
      await user.type(messageInput, 'Workflow test commit')
      await user.click(screen.getByText('Commit'))
      
      // Push
      await user.click(screen.getByText('Push'))
      
      // Verify in remote
      await user.click(screen.getByText('Remote'))
      await user.click(screen.getByText('Panel'))
      expect(screen.getByText('Remote Repository')).toBeInTheDocument()
    })

    it('T13.5: Feature branch workflow', async () => {
      render(<GitVisualPlayground />)
      
      // Create feature branch
      const branchInput = screen.getByPlaceholderText('new-branch')
      await user.type(branchInput, 'feature-branch')
      await user.click(screen.getByTitle('Create Branch'))
      
      // Switch to feature branch
      await user.click(screen.getByText('feature-branch'))
      
      // Make commit on feature branch
      const stageButton = screen.getAllByTitle('Git Add')[0]
      await user.click(stageButton)
      
      const messageInput = screen.getByPlaceholderText('Commit message')
      await user.type(messageInput, 'Feature work')
      await user.click(screen.getByText('Commit'))
      
      // Switch back to main
      await user.click(screen.getByText('main'))
      
      // Merge feature branch
      await user.click(screen.getByText(/Merge Into/))
      
      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'feature-branch')
      await user.click(screen.getByText('Merge'))
      
      expect(screen.queryByText('Merge Branch')).not.toBeInTheDocument()
    })
  })
})