// Dijkstra's Algorithm Implementation for AlgoVerse

document.addEventListener('DOMContentLoaded', function() {
    // Grid dimensions
    const ROWS = 15;
    const COLS = 15;
    
    // Grid elements
    const grid = document.getElementById('grid');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const speedSlider = document.getElementById('speed-slider');
    const setStartBtn = document.getElementById('set-start-btn');
    const setEndBtn = document.getElementById('set-end-btn');
    const setWallBtn = document.getElementById('set-wall-btn');
    const clearGridBtn = document.getElementById('clear-grid-btn');
    const randomWallsBtn = document.getElementById('random-walls-btn');
    const saveProgressBtn = document.getElementById('save-progress-btn');
    const statusMessage = document.getElementById('status-message');
    const distanceValue = document.getElementById('distance-value');
    const nodesVisited = document.getElementById('nodes-visited');
    const etaValue = document.getElementById('eta-value');
    
    // Algorithm variables
    let cells = [];
    let startCell = null;
    let endCell = null;
    let isRunning = false;
    let isPaused = false;
    let visitedCount = 0;
    let currentTool = 'start'; // 'start', 'end', 'wall'
    let animationSpeed = 6 - speedSlider.value; // Invert so higher = faster
    
    // Initialize the grid
    function initializeGrid() {
        grid.innerHTML = '';
        cells = [];
        
        for (let row = 0; row < ROWS; row++) {
            const rowCells = [];
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add alternating colors for better visibility
                if ((row + col) % 2 === 0) {
                    cell.style.backgroundColor = '#2a2a2a';
                } else {
                    cell.style.backgroundColor = '#252525';
                }
                
                cell.addEventListener('click', () => handleCellClick(row, col));
                
                grid.appendChild(cell);
                rowCells.push({
                    element: cell,
                    row: row,
                    col: col,
                    isStart: false,
                    isEnd: false,
                    isWall: false,
                    isVisited: false,
                    isPath: false,
                    distance: Infinity,
                    previousCell: null
                });
            }
            cells.push(rowCells);
        }
        
        // Set default start and end positions
        setStart(2, 2);
        setEnd(12, 12);
        
        updateStatus('Ready to start delivery planning!');
        updateMetrics(0, 0);
    }
    
    // Handle cell click based on current tool
    function handleCellClick(row, col) {
        if (isRunning) return;
        
        const cell = cells[row][col];
        
        if (currentTool === 'start') {
            if (cell.isEnd || cell.isWall) return;
            if (startCell) {
                startCell.isStart = false;
                startCell.element.classList.remove('start');
            }
            setStart(row, col);
        } else if (currentTool === 'end') {
            if (cell.isStart || cell.isWall) return;
            if (endCell) {
                endCell.isEnd = false;
                endCell.element.classList.remove('end');
            }
            setEnd(row, col);
        } else if (currentTool === 'wall') {
            if (cell.isStart || cell.isEnd) return;
            toggleWall(row, col);
        }
    }
    
    // Set start cell
    function setStart(row, col) {
        startCell = cells[row][col];
        startCell.isStart = true;
        startCell.element.classList.add('start');
        updateStatus('Pizza shop set! Now place the customer house.');
    }
    
    // Set end cell
    function setEnd(row, col) {
        endCell = cells[row][col];
        endCell.isEnd = true;
        endCell.element.classList.add('end');
        updateStatus('Customer house set! Add roadblocks if needed.');
    }
    
    // Toggle wall cell
    function toggleWall(row, col) {
        const cell = cells[row][col];
        cell.isWall = !cell.isWall;
        cell.element.classList.toggle('wall');
    }
    
    // Reset the grid
    function resetGrid() {
        isRunning = false;
        isPaused = false;
        visitedCount = 0;
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = cells[row][col];
                cell.isVisited = false;
                cell.isPath = false;
                cell.distance = Infinity;
                cell.previousCell = null;
                cell.element.classList.remove('visited', 'path');
            }
        }
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        updateStatus('Grid reset. Ready to start again!');
        updateMetrics(0, 0);
    }
    
    // Clear the entire grid
    function clearGrid() {
        isRunning = false;
        isPaused = false;
        visitedCount = 0;
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = cells[row][col];
                cell.isStart = false;
                cell.isEnd = false;
                cell.isWall = false;
                cell.isVisited = false;
                cell.isPath = false;
                cell.distance = Infinity;
                cell.previousCell = null;
                cell.element.classList.remove('start', 'end', 'wall', 'visited', 'path');
            }
        }
        
        startCell = null;
        endCell = null;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        updateStatus('Grid cleared. Set a new pizza shop and customer house!');
        updateMetrics(0, 0);
    }
    
    // Generate random walls
    function generateRandomWalls() {
        if (isRunning) return;
        
        // Clear existing walls
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = cells[row][col];
                if (cell.isWall) {
                    cell.isWall = false;
                    cell.element.classList.remove('wall');
                }
            }
        }
        
        // Generate new walls (about 20% of the grid)
        const wallCount = Math.floor(ROWS * COLS * 0.2);
        for (let i = 0; i < wallCount; i++) {
            const row = Math.floor(Math.random() * ROWS);
            const col = Math.floor(Math.random() * COLS);
            const cell = cells[row][col];
            
            if (!cell.isStart && !cell.isEnd && !cell.isWall) {
                cell.isWall = true;
                cell.element.classList.add('wall');
            }
        }
        
        updateStatus('Random roadblocks added! Ready to find the path.');
    }
    
    // Update status message
    function updateStatus(message) {
        statusMessage.textContent = message;
        statusMessage.classList.add('status-update');
        setTimeout(() => {
            statusMessage.classList.remove('status-update');
        }, 500);
    }
    
    // Update metrics display
    function updateMetrics(distance, visited) {
        distanceValue.textContent = distance;
        nodesVisited.textContent = visited;
        
        // Calculate ETA (just for fun)
        if (distance === 0 || distance === Infinity) {
            etaValue.textContent = '--:--';
        } else {
            const minutes = Math.floor(distance / 5);
            const seconds = Math.floor((distance % 5) * 12);
            etaValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Run Dijkstra's algorithm
    async function runDijkstra() {
        if (!startCell || !endCell) {
            updateStatus('Please set both pizza shop and customer house!');
            return;
        }
        
        isRunning = true;
        isPaused = false;
        visitedCount = 0;
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        // Reset previous run
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = cells[row][col];
                if (!cell.isStart && !cell.isEnd && !cell.isWall) {
                    cell.isVisited = false;
                    cell.isPath = false;
                    cell.distance = Infinity;
                    cell.previousCell = null;
                    cell.element.classList.remove('visited', 'path');
                }
            }
        }
        
        // Initialize start cell
        startCell.distance = 0;
        
        // Priority queue (simple array for demo)
        const unvisitedCells = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                unvisitedCells.push(cells[row][col]);
            }
        }
        
        updateStatus('Starting delivery route planning...');
        
        // Main algorithm loop
        while (unvisitedCells.length > 0) {
            // Check if paused
            if (isPaused) {
                await new Promise(resolve => {
                    const checkPause = () => {
                        if (isPaused) {
                            setTimeout(checkPause, 100);
                        } else {
                            resolve();
                        }
                    };
                    checkPause();
                });
            }
            
            // Sort by distance and get the closest cell
            unvisitedCells.sort((a, b) => a.distance - b.distance);
            const currentCell = unvisitedCells.shift();
            
            // If we reached the end or there's no path
            if (currentCell.distance === Infinity) {
                updateStatus('No path found to the customer! Try removing some roadblocks.');
                isRunning = false;
                pauseBtn.disabled = true;
                return;
            }
            
            if (currentCell.isEnd) {
                await reconstructPath();
                updateStatus('Path found! Pizza is on the way to the customer!');
                playSound('complete');
                isRunning = false;
                pauseBtn.disabled = true;
                
                // Save progress (50% completion for finding a path)
                saveProgress('dijkstra', { percent: 50, pathFound: true });
                return;
            }
            
            // Mark as visited
            if (!currentCell.isStart && !currentCell.isEnd) {
                currentCell.isVisited = true;
                currentCell.element.classList.add('visited');
                visitedCount++;
                updateMetrics(currentCell.distance, visitedCount);
                
                // Add delay for visualization
                await sleep(animationSpeed * 50);
            }
            
            // Get neighbors
            const neighbors = getNeighbors(currentCell);
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited && !neighbor.isWall) {
                    const tentativeDistance = currentCell.distance + 1;
                    if (tentativeDistance < neighbor.distance) {
                        neighbor.distance = tentativeDistance;
                        neighbor.previousCell = currentCell;
                    }
                }
            }
        }
        
        updateStatus('No path found to the customer! Try removing some roadblocks.');
        isRunning = false;
        pauseBtn.disabled = true;
    }
    
    // Get neighboring cells
    function getNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;
        
        // Check all four directions
        if (row > 0) neighbors.push(cells[row - 1][col]); // Up
        if (row < ROWS - 1) neighbors.push(cells[row + 1][col]); // Down
        if (col > 0) neighbors.push(cells[row][col - 1]); // Left
        if (col < COLS - 1) neighbors.push(cells[row][col + 1]); // Right
        
        return neighbors;
    }
    
    // Reconstruct and animate the path
    async function reconstructPath() {
        let currentCell = endCell;
        const path = [];
        
        while (currentCell !== startCell) {
            path.unshift(currentCell);
            currentCell = currentCell.previousCell;
            if (!currentCell) break; // No path found
        }
        
        // Animate the path
        for (const cell of path) {
            if (!cell.isEnd) {
                cell.isPath = true;
                cell.element.classList.add('path');
                await sleep(100); // Slower animation for path
                playSound('click');
            }
        }
        
        // Update final metrics
        updateMetrics(path.length, visitedCount);
        return path.length;
    }
    
    // Event listeners
    startBtn.addEventListener('click', runDijkstra);
    
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        updateStatus(isPaused ? 'Delivery planning paused.' : 'Resuming delivery planning...');
    });
    
    resetBtn.addEventListener('click', resetGrid);
    
    speedSlider.addEventListener('input', () => {
        animationSpeed = 6 - speedSlider.value; // Invert so higher = faster
    });
    
    setStartBtn.addEventListener('click', () => {
        currentTool = 'start';
        setStartBtn.classList.add('active');
        setEndBtn.classList.remove('active');
        setWallBtn.classList.remove('active');
    });
    
    setEndBtn.addEventListener('click', () => {
        currentTool = 'end';
        setStartBtn.classList.remove('active');
        setEndBtn.classList.add('active');
        setWallBtn.classList.remove('active');
    });
    
    setWallBtn.addEventListener('click', () => {
        currentTool = 'wall';
        setStartBtn.classList.remove('active');
        setEndBtn.classList.remove('active');
        setWallBtn.classList.add('active');
    });
    
    clearGridBtn.addEventListener('click', clearGrid);
    randomWallsBtn.addEventListener('click', generateRandomWalls);
    
    saveProgressBtn.addEventListener('click', () => {
        // Save 100% progress when user explicitly saves
        saveProgress('dijkstra', { percent: 100, completed: true });
        updateStatus('Progress saved successfully!');
    });
    
    // Initialize the grid when the page loads
    initializeGrid();
    
    // Load user progress if available
    getProgress('dijkstra', (progress) => {
        if (progress && progress.percent) {
            // Update progress display
            updateStatus(`Welcome back! You've completed ${progress.percent}% of this algorithm.`);
        }
    });
});