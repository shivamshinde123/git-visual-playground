import React, { useEffect, useState, forwardRef } from 'react';

const GitCanvas = forwardRef(({ commits, branches, head, selectedCommit, setSelectedCommit, isRemoteView = false }, ref) => {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);

  const branchColors = {
    main: '#fb8500',
    develop: '#8338ec',
    feature: '#06ffa5',
    hotfix: '#ff006e',
    release: '#3a86ff',
    bugfix: '#ffbe0b',
    test: '#fb5607',
    staging: '#8ecae6'
  };
  
  const getBranchColor = (branch) => {
    if (branchColors[branch]) return branchColors[branch];
    const colors = ['#ff006e', '#3a86ff', '#ffbe0b', '#06ffa5', '#fb5607', '#8ecae6', '#219ebc', '#023047'];
    const hash = branch.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const buildCommitTree = () => {
    const commitMap = new Map();
    commits.forEach(c => commitMap.set(c.id, { ...c, children: [] }));
    
    commits.forEach(c => {
      c.parents.forEach(parentId => {
        if (commitMap.has(parentId)) {
          commitMap.get(parentId).children.push(c.id);
        }
      });
    });
    
    const branchPaths = new Map();
    Object.entries(branches).forEach(([branchName, commitId]) => {
      const path = [];
      let current = commitId;
      while (current) {
        path.unshift(current);
        const commit = commitMap.get(current);
        current = commit?.parentId;
      }
      branchPaths.set(branchName, path);
    });
    
    const commitToLane = new Map();
    let currentLane = 0;
    
    const sortedBranches = Object.entries(branches).sort((a, b) => {
      const pathA = branchPaths.get(a[0]);
      const pathB = branchPaths.get(b[0]);
      return pathA.length - pathB.length;
    });
    
    sortedBranches.forEach(([branchName, tipCommit]) => {
      const path = branchPaths.get(branchName);
      let assignedLane = null;
      
      for (let i = path.length - 1; i >= 0; i--) {
        const commitId = path[i];
        if (commitToLane.has(commitId)) {
          assignedLane = currentLane++;
          break;
        }
      }
      
      if (assignedLane === null) {
        assignedLane = currentLane++;
      }
      
      let startAssigning = false;
      for (let i = 0; i < path.length; i++) {
        const commitId = path[i];
        if (!commitToLane.has(commitId)) {
          commitToLane.set(commitId, assignedLane);
          startAssigning = true;
        } else if (startAssigning) {
          break;
        }
      }
    });
    
    return { commitMap, commitToLane };
  };

  useEffect(() => {
    const canvas = ref.canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = rect.width;
    const height = rect.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    const gridSize = 20 * zoom;
    
    for (let x = panOffset.x % gridSize; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = panOffset.y % gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    const { commitMap, commitToLane } = buildCommitTree();
    
    const HORIZONTAL_SPACING = 150 * zoom;
    const VERTICAL_SPACING = 100 * zoom;
    const COMMIT_RADIUS = 16 * zoom;
    
    const positions = new Map();
    const visited = new Set();
    
    const calculatePositions = (commitId, column = 0) => {
      if (visited.has(commitId)) return;
      visited.add(commitId);
      
      const commit = commitMap.get(commitId);
      if (!commit) return;
      
      const lane = commitToLane.get(commitId) || 0;
      const x = column * HORIZONTAL_SPACING + 100 + panOffset.x;
      const y = lane * VERTICAL_SPACING + 100 + panOffset.y;
      
      positions.set(commitId, { x, y, commit });
      
      commit.children.forEach(childId => {
        calculatePositions(childId, column + 1);
      });
    };
    
    calculatePositions('commit-0', 0);
    
    // Draw edges
    commits.forEach(commit => {
      commit.parents.forEach((parentId, index) => {
        const parentPos = positions.get(parentId);
        const childPos = positions.get(commit.id);
        
        if (!parentPos || !childPos) return;
        
        const isMergeEdge = commit.isMerge && index === 1;
        
        ctx.strokeStyle = isMergeEdge ? '#8b5cf6' : '#4b5563';
        ctx.lineWidth = isMergeEdge ? 4 * zoom : 3 * zoom;
        ctx.setLineDash(isMergeEdge ? [8 * zoom, 4 * zoom] : []);
        ctx.beginPath();
        
        const isStraight = Math.abs(parentPos.y - childPos.y) < 10;
        
        if (isStraight) {
          ctx.moveTo(parentPos.x, parentPos.y);
          ctx.lineTo(childPos.x, childPos.y);
        } else {
          const controlX1 = parentPos.x + (childPos.x - parentPos.x) * 0.5;
          const controlY1 = parentPos.y;
          const controlX2 = parentPos.x + (childPos.x - parentPos.x) * 0.5;
          const controlY2 = childPos.y;
          
          ctx.moveTo(parentPos.x, parentPos.y);
          ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, childPos.x, childPos.y);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });
    
    const currentCommitId = branches[head];
    const commitToBranches = {};
    Object.entries(branches).forEach(([branchName, commitId]) => {
      if (!commitToBranches[commitId]) commitToBranches[commitId] = [];
      commitToBranches[commitId].push(branchName);
    });
    
    positions.forEach((pos, commitId) => {
      const commit = pos.commit;
      const color = getBranchColor(commit.branch);
      const isHead = currentCommitId === commitId;
      const isSelected = selectedCommit === commitId;
      
      // Draw commit circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, COMMIT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 4 * zoom;
      ctx.stroke();
      
      if (isHead) {
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 6 * zoom;
        ctx.stroke();
      }
      
      if (isSelected) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4 * zoom;
        ctx.stroke();
      }
      
      // Draw merge indicator
      if (commit.isMerge) {
        ctx.fillStyle = '#8b5cf6';
        ctx.font = `bold ${10 * zoom}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('M', pos.x, pos.y + 4 * zoom);
      }
      
      // Draw branch labels
      const branchesHere = commitToBranches[commitId] || [];
      if (branchesHere.length > 0) {
        ctx.font = `bold ${12 * zoom}px monospace`;
        ctx.textAlign = 'center';
        
        branchesHere.forEach((branchName, index) => {
          const labelY = pos.y - COMMIT_RADIUS - 20 * zoom - (index * 22 * zoom);
          const labelX = pos.x;
          
          ctx.fillStyle = getBranchColor(branchName);
          const textWidth = ctx.measureText(branchName).width;
          ctx.fillRect(labelX - textWidth/2 - 6 * zoom, labelY - 10 * zoom, textWidth + 12 * zoom, 18 * zoom);
          ctx.fillStyle = '#000000';
          ctx.fillText(branchName, labelX, labelY + 4 * zoom);
        });
      }
      
      // Draw HEAD label
      if (isHead) {
        ctx.font = `bold ${12 * zoom}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#06ffa5';
        const headY = pos.y + COMMIT_RADIUS + 25 * zoom;
        ctx.fillRect(pos.x - 25 * zoom, headY - 10 * zoom, 50 * zoom, 18 * zoom);
        ctx.fillStyle = '#000000';
        ctx.fillText('HEAD', pos.x, headY + 4 * zoom);
      }
    });
    
  }, [commits, branches, head, selectedCommit, panOffset, zoom]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      const canvas = ref.canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const { commitMap, commitToLane } = buildCommitTree();
      const HORIZONTAL_SPACING = 150 * zoom;
      const VERTICAL_SPACING = 100 * zoom;
      const COMMIT_RADIUS = 16 * zoom;
      
      const positions = new Map();
      const visited = new Set();
      
      const calculatePositions = (commitId, column = 0) => {
        if (visited.has(commitId)) return;
        visited.add(commitId);
        
        const commit = commitMap.get(commitId);
        if (!commit) return;
        
        const lane = commitToLane.get(commitId) || 0;
        const cx = column * HORIZONTAL_SPACING + 100 + panOffset.x;
        const cy = lane * VERTICAL_SPACING + 100 + panOffset.y;
        
        positions.set(commitId, { x: cx, y: cy });
        
        commit.children.forEach(childId => {
          calculatePositions(childId, column + 1);
        });
      };
      
      calculatePositions('commit-0', 0);
      
      let clickedCommit = null;
      positions.forEach((pos, commitId) => {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance <= COMMIT_RADIUS) {
          clickedCommit = commitId;
        }
      });
      
      if (clickedCommit) {
        setSelectedCommit(clickedCommit);
      } else {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(2, prev * delta)));
  };

  return (
    <div 
      ref={ref.containerRef}
      className="flex-1 relative bg-gray-950 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas
        ref={ref.canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />
      
      <div className="absolute bottom-4 left-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 text-xs text-gray-400 space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`font-semibold ${isRemoteView ? 'text-blue-400' : 'text-emerald-400'}`}>
            {isRemoteView ? 'Remote Repository' : 'Local Repository'}
          </span>
        </div>
        
        {/* Dynamic branch legend */}
        {Object.keys(branches).length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-300 mb-1">Branches:</div>
            {Object.keys(branches).map(branchName => {
              const color = getBranchColor(branchName);
              return (
                <div key={branchName} className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></span>
                  <span>{branchName}</span>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="border-t border-gray-700 pt-1 mt-1 space-y-0.5">
          <div>🖱️ Drag to pan</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Click commit for details</div>
        </div>
      </div>
    </div>
  );
});

export default GitCanvas;