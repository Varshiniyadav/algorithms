// Merge Sort Algorithm Implementation for AlgoVerse

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const arrayVisual = document.getElementById('array-visual');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const speedSlider = document.getElementById('speed-slider');
    const arraySizeSlider = document.getElementById('array-size');
    const arraySizeValue = document.getElementById('array-size-value');
    const generateArrayBtn = document.getElementById('generate-array-btn');
    const customArrayBtn = document.getElementById('custom-array-btn');
    const customArrayInput = document.getElementById('custom-array-input');
    const arrayInput = document.getElementById('array-input');
    const applyCustomArrayBtn = document.getElementById('apply-custom-array');
    const saveProgressBtn = document.getElementById('save-progress-btn');
    const statusMessage = document.getElementById('status-message');
    const comparisonsValue = document.getElementById('comparisons-value');
    const arrayAccessesValue = document.getElementById('array-accesses');
    
    // Algorithm variables
    let array = [];
    let arrayBars = [];
    let isRunning = false;
    let isPaused = false;
    let comparisons = 0;
    let arrayAccesses = 0;
    let animationSpeed = 6 - speedSlider.value; // Invert so higher = faster
    let arraySize = parseInt(arraySizeSlider.value);
    
    // Initialize the array
    function initializeArray() {
        array = [];
        comparisons = 0;
        arrayAccesses = 0;
        
        // Generate random array
        for (let i = 0; i < arraySize; i++) {
            // Random values between 10 and 99 (for pizza delivery times in minutes)
            array.push(Math.floor(Math.random() * 90) + 10);
        }
        
        updateArrayVisual();
        updateMetrics();
        updateStatus('New pizza orders generated! Ready to sort by delivery time.');
    }
    
    // Update the visual representation of the array
    function updateArrayVisual() {
        arrayVisual.innerHTML = '';
        arrayBars = [];
        
        const maxValue = Math.max(...array);
        const containerHeight = arrayVisual.clientHeight - 30; // Leave space for labels
        
        for (let i = 0; i < array.length; i++) {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${(array[i] / maxValue) * containerHeight}px`;
            bar.dataset.value = array[i];
            
            arrayVisual.appendChild(bar);
            arrayBars.push(bar);
        }
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
    function updateMetrics() {
        comparisonsValue.textContent = comparisons;
        arrayAccessesValue.textContent = arrayAccesses;
    }
    
    // Reset the visualization
    function resetVisualization() {
        isRunning = false;
        isPaused = false;
        comparisons = 0;
        arrayAccesses = 0;
        
        updateArrayVisual();
        updateMetrics();
        updateStatus('Reset complete. Ready to sort again!');
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Main merge sort function
    async function mergeSort() {
        if (isRunning) return;
        
        isRunning = true;
        isPaused = false;
        comparisons = 0;
        arrayAccesses = 0;
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        updateStatus('Starting to sort pizza orders...');
        
        // Create a copy of the array to sort
        const sortedArray = [...array];
        
        // Start the recursive merge sort
        await mergeSortRecursive(sortedArray, 0, sortedArray.length - 1);
        
        // Mark all bars as sorted
        for (let i = 0; i < arrayBars.length; i++) {
            arrayBars[i].classList.add('sorted');
            await sleep(50);
        }
        
        isRunning = false;
        pauseBtn.disabled = true;
        updateStatus('Sorting complete! Pizza orders are now organized by delivery time.');
        playSound('complete');
        
        // Save progress (100% completion for finishing the sort)
        saveProgress('mergesort', { percent: 100, completed: true });
    }
    
    // Recursive merge sort implementation
    async function mergeSortRecursive(arr, left, right) {
        if (left >= right) return;
        
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
        
        const mid = Math.floor((left + right) / 2);
        
        // Highlight the current subarray being divided
        for (let i = left; i <= right; i++) {
            arrayBars[i].style.backgroundColor = 'var(--secondary-color)';
            arrayAccesses++;
        }
        
        await sleep(animationSpeed * 100);
        updateStatus(`Dividing orders from ${left} to ${right}`);
        updateMetrics();
        
        // Reset colors before recursion
        for (let i = left; i <= right; i++) {
            arrayBars[i].style.backgroundColor = 'var(--primary-color)';
        }
        
        // Recursively sort the left half
        await mergeSortRecursive(arr, left, mid);
        
        // Recursively sort the right half
        await mergeSortRecursive(arr, mid + 1, right);
        
        // Merge the sorted halves
        await merge(arr, left, mid, right);
    }
    
    // Merge function
    async function merge(arr, left, mid, right) {
        const leftSize = mid - left + 1;
        const rightSize = right - mid;
        
        // Create temporary arrays
        const leftArray = new Array(leftSize);
        const rightArray = new Array(rightSize);
        
        // Copy data to temporary arrays
        for (let i = 0; i < leftSize; i++) {
            leftArray[i] = arr[left + i];
            arrayAccesses++;
        }
        
        for (let j = 0; j < rightSize; j++) {
            rightArray[j] = arr[mid + 1 + j];
            arrayAccesses++;
        }
        
        // Highlight the subarrays being merged
        updateStatus(`Merging subarrays: [${leftArray.join(', ')}] and [${rightArray.join(', ')}]`);
        
        // Merge the temporary arrays back into the original array
        let i = 0, j = 0, k = left;
        
        while (i < leftSize && j < rightSize) {
            // Compare elements from both subarrays
            comparisons++;
            arrayAccesses += 2;
            
            // Highlight the elements being compared
            arrayBars[left + i].classList.add('comparing');
            arrayBars[mid + 1 + j].classList.add('comparing');
            
            await sleep(animationSpeed * 100);
            
            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            
            // Update the visual representation
            arrayBars[k].style.height = `${(arr[k] / Math.max(...array)) * (arrayVisual.clientHeight - 30)}px`;
            arrayBars[k].dataset.value = arr[k];
            arrayBars[k].classList.add('sorted');
            
            // Remove the comparing class
            arrayBars[left + i - 1].classList.remove('comparing');
            arrayBars[mid + 1 + j - 1].classList.remove('comparing');
            
            k++;
            arrayAccesses++;
            updateMetrics();
            
            await sleep(animationSpeed * 50);
        }
        
        // Copy the remaining elements of leftArray
        while (i < leftSize) {
            arr[k] = leftArray[i];
            arrayBars[k].style.height = `${(arr[k] / Math.max(...array)) * (arrayVisual.clientHeight - 30)}px`;
            arrayBars[k].dataset.value = arr[k];
            arrayBars[k].classList.add('sorted');
            
            i++;
            k++;
            arrayAccesses += 2;
            updateMetrics();
            
            await sleep(animationSpeed * 50);
        }
        
        // Copy the remaining elements of rightArray
        while (j < rightSize) {
            arr[k] = rightArray[j];
            arrayBars[k].style.height = `${(arr[k] / Math.max(...array)) * (arrayVisual.clientHeight - 30)}px`;
            arrayBars[k].dataset.value = arr[k];
            arrayBars[k].classList.add('sorted');
            
            j++;
            k++;
            arrayAccesses += 2;
            updateMetrics();
            
            await sleep(animationSpeed * 50);
        }
        
        // Update the array with the merged values
        for (let i = left; i <= right; i++) {
            array[i] = arr[i];
        }
    }
    
    // Apply custom array from user input
    function applyCustomArray() {
        const input = arrayInput.value.trim();
        const values = input.split(',').map(val => parseInt(val.trim()));
        
        // Validate input
        if (values.some(isNaN)) {
            updateStatus('Invalid input! Please enter numbers separated by commas.');
            return;
        }
        
        // Update array size and array
        arraySize = values.length;
        arraySizeSlider.value = Math.min(Math.max(values.length, 4), 20);
        arraySizeValue.textContent = arraySize;
        
        array = values;
        updateArrayVisual();
        updateStatus('Custom pizza orders applied! Ready to sort.');
        
        // Hide custom array input
        customArrayInput.style.display = 'none';
    }
    
    // Event listeners
    startBtn.addEventListener('click', mergeSort);
    
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        updateStatus(isPaused ? 'Sorting paused.' : 'Resuming sorting...');
    });
    
    resetBtn.addEventListener('click', resetVisualization);
    
    speedSlider.addEventListener('input', () => {
        animationSpeed = 6 - speedSlider.value; // Invert so higher = faster
    });
    
    arraySizeSlider.addEventListener('input', () => {
        arraySize = parseInt(arraySizeSlider.value);
        arraySizeValue.textContent = arraySize;
        initializeArray();
    });
    
    generateArrayBtn.addEventListener('click', initializeArray);
    
    customArrayBtn.addEventListener('click', () => {
        customArrayInput.style.display = customArrayInput.style.display === 'none' ? 'flex' : 'none';
    });
    
    applyCustomArrayBtn.addEventListener('click', applyCustomArray);
    
    saveProgressBtn.addEventListener('click', () => {
        // Save 100% progress when user explicitly saves
        saveProgress('mergesort', { percent: 100, completed: true });
        updateStatus('Progress saved successfully!');
    });
    
    // Initialize the array when the page loads
    initializeArray();
    
    // Load user progress if available
    getProgress('mergesort', (progress) => {
        if (progress && progress.percent) {
            // Update progress display
            updateStatus(`Welcome back! You've completed ${progress.percent}% of this algorithm.`);
        }
    });
});