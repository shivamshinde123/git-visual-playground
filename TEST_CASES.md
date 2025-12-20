# Git Visual Playground Test Cases

## 1. Initial State Tests
- [ ] **T1.1**: App loads with local view showing initial commit
- [ ] **T1.2**: Remote view is completely empty (no commits, branches, files)
- [ ] **T1.3**: Local has 2 sample files in working directory
- [ ] **T1.4**: Staging area is empty in both views
- [ ] **T1.5**: HEAD points to main branch in local

## 2. File Management Tests
### Local File Operations
- [ ] **T2.1**: Add new file to local working directory
- [ ] **T2.2**: Stage file from working directory to staging area
- [ ] **T2.3**: Unstage file from staging area back to working directory
- [ ] **T2.4**: Stage multiple files at once
- [ ] **T2.5**: Add file with special characters in name
- [ ] **T2.6**: Add file with empty name (should fail)

### Remote File Operations
- [ ] **T2.7**: Switch to remote view and add file
- [ ] **T2.8**: Stage file in remote view
- [ ] **T2.9**: Unstage file in remote view
- [ ] **T2.10**: Files in local and remote are independent

## 3. Commit Tests
### Local Commits
- [ ] **T3.1**: Commit with staged files and message
- [ ] **T3.2**: Commit without staged files (should fail)
- [ ] **T3.3**: Commit without message (should fail)
- [ ] **T3.4**: Commit clears staging area and working directory
- [ ] **T3.5**: Multiple sequential commits create chain
- [ ] **T3.6**: Commit message appears in commit details

### Remote Commits
- [ ] **T3.7**: Commit in remote view works independently
- [ ] **T3.8**: Remote commits have different IDs than local
- [ ] **T3.9**: Remote commit counter is independent

### First Commits
- [ ] **T3.10**: First commit in remote creates initial commit with no parents
- [ ] **T3.11**: First commit creates branch reference

## 4. Branch Operations Tests
### Local Branch Operations
- [ ] **T4.1**: Create new branch from current commit
- [ ] **T4.2**: Switch between branches (checkout)
- [ ] **T4.3**: Branch creation with empty name (should fail)
- [ ] **T4.4**: Branch creation with duplicate name (should fail)
- [ ] **T4.5**: Active branch is highlighted
- [ ] **T4.6**: HEAD follows branch switches

### Remote Branch Operations
- [ ] **T4.7**: Create branch in remote view
- [ ] **T4.8**: Switch branches in remote view
- [ ] **T4.9**: Remote branches independent from local

### Branch Visualization
- [ ] **T4.10**: Different branches show different colors
- [ ] **T4.11**: Branch labels appear on commits
- [ ] **T4.12**: HEAD label shows current position

## 5. Merge Operations Tests
- [ ] **T5.1**: Merge branch into main
- [ ] **T5.2**: Merge creates commit with two parents
- [ ] **T5.3**: Merge commit shows 'M' indicator
- [ ] **T5.4**: Merge with no other branches (should fail)
- [ ] **T5.5**: Merge branch into itself (should fail)
- [ ] **T5.6**: Merge commit message includes branch names

## 6. Push/Pull Tests
### Push Operations
- [ ] **T6.1**: Push local commits to empty remote
- [ ] **T6.2**: Push creates commits in remote
- [ ] **T6.3**: Push updates remote branch pointers
- [ ] **T6.4**: Push with no new commits
- [ ] **T6.5**: Push multiple commits at once
- [ ] **T6.6**: Push shows correct count in toast

### Pull Operations
- [ ] **T6.7**: Pull remote commits to local
- [ ] **T6.8**: Pull updates local branch pointers
- [ ] **T6.9**: Pull with no remote commits (should fail)
- [ ] **T6.10**: Pull shows correct count in toast
- [ ] **T6.11**: Pull non-existent remote branch (should fail)

### Sync Scenarios
- [ ] **T6.12**: Local ahead of remote (push scenario)
- [ ] **T6.13**: Remote ahead of local (pull scenario)
- [ ] **T6.14**: Both have different commits (conflict scenario)

## 7. View Switching Tests
- [ ] **T7.1**: Switch from local to remote view
- [ ] **T7.2**: Switch from remote to local view
- [ ] **T7.3**: View toggle buttons highlight correctly
- [ ] **T7.4**: Canvas shows correct repository data
- [ ] **T7.5**: Working directory shows correct files
- [ ] **T7.6**: Staging area shows correct files
- [ ] **T7.7**: Branch operations work in correct context

## 8. Canvas Interaction Tests
### Mouse Operations
- [ ] **T8.1**: Click commit to select and show details
- [ ] **T8.2**: Drag canvas to pan view
- [ ] **T8.3**: Scroll to zoom in/out
- [ ] **T8.4**: Click empty area deselects commit
- [ ] **T8.5**: Selected commit highlights with yellow border

### Visual Elements
- [ ] **T8.6**: Commits show as colored circles
- [ ] **T8.7**: Edges connect parent-child commits
- [ ] **T8.8**: Merge edges show as dashed lines
- [ ] **T8.9**: Branch labels appear above commits
- [ ] **T8.10**: HEAD label appears below current commit
- [ ] **T8.11**: Grid background is visible
- [ ] **T8.12**: Legend shows current view (local/remote)

## 9. Dialog Tests
### Add File Dialog
- [ ] **T9.1**: Dialog opens when clicking "Add File"
- [ ] **T9.2**: Dialog closes on cancel
- [ ] **T9.3**: Dialog closes on successful add
- [ ] **T9.4**: Enter key submits form
- [ ] **T9.5**: Empty filename disables submit button

### Merge Dialog
- [ ] **T9.6**: Dialog opens when clicking "Merge"
- [ ] **T9.7**: Dialog shows available branches
- [ ] **T9.8**: Dialog closes on cancel
- [ ] **T9.9**: Dialog closes on successful merge
- [ ] **T9.10**: No branches available disables merge button

### Commit Details Panel
- [ ] **T9.11**: Panel shows commit hash
- [ ] **T9.12**: Panel shows commit message
- [ ] **T9.13**: Panel shows branch name
- [ ] **T9.14**: Panel shows timestamp
- [ ] **T9.15**: Panel shows parent commits
- [ ] **T9.16**: Panel shows merge indicator for merge commits

### Remote Panel
- [ ] **T9.17**: Panel shows remote branches
- [ ] **T9.18**: Panel shows commit count
- [ ] **T9.19**: Panel opens/closes correctly

## 10. Toast Notification Tests
- [ ] **T10.1**: Toast appears on file staging
- [ ] **T10.2**: Toast appears on file unstaging
- [ ] **T10.3**: Toast appears on commit
- [ ] **T10.4**: Toast appears on push with count
- [ ] **T10.5**: Toast appears on pull with count
- [ ] **T10.6**: Toast appears on file addition
- [ ] **T10.7**: Toast appears on reset
- [ ] **T10.8**: Toast shows correct repository (local/remote)

## 11. Reset Functionality Tests
- [ ] **T11.1**: Reset clears all local commits except initial
- [ ] **T11.2**: Reset clears all remote data
- [ ] **T11.3**: Reset restores sample files to local working directory
- [ ] **T11.4**: Reset clears staging areas
- [ ] **T11.5**: Reset resets commit counters
- [ ] **T11.6**: Reset switches to local view
- [ ] **T11.7**: Reset shows toast notification

## 12. Edge Cases and Error Handling
### Invalid Operations
- [ ] **T12.1**: Commit without staged files shows no action
- [ ] **T12.2**: Commit without message shows no action
- [ ] **T12.3**: Create branch with existing name shows no action
- [ ] **T12.4**: Pull from non-existent remote branch shows no action
- [ ] **T12.5**: Merge with no other branches disables button

### Boundary Conditions
- [ ] **T12.6**: Very long commit messages display correctly
- [ ] **T12.7**: Very long file names display correctly
- [ ] **T12.8**: Many commits render without performance issues
- [ ] **T12.9**: Many branches render correctly
- [ ] **T12.10**: Deep zoom levels work correctly

### State Consistency
- [ ] **T12.11**: Switching views maintains separate state
- [ ] **T12.12**: Push/pull maintains commit relationships
- [ ] **T12.13**: Branch operations don't affect other view
- [ ] **T12.14**: File operations are isolated per view

## 13. Complex Workflow Tests
### Standard Git Workflow
- [ ] **T13.1**: Add file → Stage → Commit → Push → Switch to remote → Verify
- [ ] **T13.2**: Remote: Add file → Stage → Commit → Switch to local → Pull → Verify
- [ ] **T13.3**: Create branch → Switch → Commit → Merge back to main
- [ ] **T13.4**: Multiple developers workflow (local commits, remote commits, sync)

### Branching Workflows
- [ ] **T13.5**: Feature branch workflow: branch → commit → merge
- [ ] **T13.6**: Multiple branches with different commits
- [ ] **T13.7**: Branch from non-main branch
- [ ] **T13.8**: Merge multiple branches

### Sync Scenarios
- [ ] **T13.9**: Local and remote diverge, then sync
- [ ] **T13.10**: Push multiple branches
- [ ] **T13.11**: Pull updates multiple branches
- [ ] **T13.12**: Reset after complex operations

## 14. Performance Tests
- [ ] **T14.1**: App loads quickly
- [ ] **T14.2**: Canvas renders smoothly with many commits
- [ ] **T14.3**: View switching is responsive
- [ ] **T14.4**: Pan and zoom operations are smooth
- [ ] **T14.5**: No memory leaks during extended use

## 15. Accessibility Tests
- [ ] **T15.1**: All buttons have proper labels
- [ ] **T15.2**: Keyboard navigation works
- [ ] **T15.3**: Color contrast is sufficient
- [ ] **T15.4**: Screen reader compatibility
- [ ] **T15.5**: Focus indicators are visible

## Test Execution Checklist
- [ ] Run all tests in local view
- [ ] Run all tests in remote view  
- [ ] Test view switching during operations
- [ ] Test with different screen sizes
- [ ] Test with different browsers
- [ ] Test error scenarios
- [ ] Test performance with large datasets
- [ ] Verify toast notifications for all actions
- [ ] Verify visual consistency
- [ ] Test complete workflows end-to-end