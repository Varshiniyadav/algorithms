import { playSound, generateRandomArray, formatTime } from './main.js';

const arrayContainer = document.getElementById('array-container');
const stepsCounter = document.getElementById('steps-counter');
const timeDisplay = document.getElementById('time-display');
const comparisonsValue = document.getElementById('comparisons-value');
const arrayAccesses = document.getElementById('array-accesses');
const statusMessage = document.getElementById('status-message');
const arraySizeInput = document.getElementById('array-size');
const arraySizeValue = document.getElementById('array-size-value');
const generateArrayBtn = document.getElementById('generate-array-btn');
const customArrayBtn = document.getElementById('custom-array-btn');
const customArrayInput = document.getElementById('custom-array-input');
const arrayInput = document.getElementById('array-input');
const applyCustomArrayBtn = document.getElementById('apply-custom-array');
const saveProgressBtn = document.getElementById('save-progress-btn');

let array = generateRandomArray(8);
let steps = 0;
let comparisons = 0;
let arrayAccessCount = 0;
let isPaused = false;
let resumeSort = null;

function renderArray(arr, highlight = []) {
    if (!arrayContainer) {
        console.error('Array container element not found');
        return;
    }
    arrayContainer.innerHTML = '';
    arr.forEach((value, i) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.style.height = `${value}px`;
        element.style.width = '30px';
        element.style.margin = '0 2px';
        element.style.backgroundColor = highlight.includes(i) ? '#ff6b6b' : '#4ecdc4';
        
        const valueLabel = document.createElement('div');
        valueLabel.className = 'array-value';
        valueLabel.textContent = value;
        element.appendChild(valueLabel);
        
        arrayContainer.appendChild(element);
    });
    
    comparisonsValue.textContent = comparisons;
    arrayAccesses.textContent = arrayAccessCount;
}

async function mergeSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        if (isPaused) {
            await new Promise(resolve => {
                resumeSort = resolve;
            });
        }
        
        steps++;
        stepsCounter.textContent = `Steps: ${steps}`;
        
        comparisons++;
        arrayAccessCount += 2;
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
            arrayAccessCount += 2;
        } else {
            arr[k++] = rightArr[j++];
            arrayAccessCount += 2;
        }
        
        renderArray(arr, [k - 1]);
        playSound('compare');
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    while (i < leftArr.length) {
        arr[k++] = leftArr[i++];
        arrayAccessCount += 2;
        renderArray(arr, [k - 1]);
        playSound('swap');
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    while (j < rightArr.length) {
        arr[k++] = rightArr[j++];
        arrayAccessCount += 2;
        renderArray(arr, [k - 1]);
        playSound('swap');
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Initialize controls
arraySizeInput.addEventListener('input', () => {
    const size = parseInt(arraySizeInput.value);
    arraySizeValue.textContent = size;
    array = generateRandomArray(size);
    renderArray(array);
});

generateArrayBtn.addEventListener('click', () => {
    array = generateRandomArray(parseInt(arraySizeInput.value));
    renderArray(array);
    statusMessage.textContent = 'New array generated!';
});

customArrayBtn.addEventListener('click', () => {
    customArrayInput.style.display = customArrayInput.style.display === 'none' ? 'block' : 'none';
});

applyCustomArrayBtn.addEventListener('click', () => {
    try {
        const inputValues = arrayInput.value.split(',').map(Number);
        if (inputValues.some(isNaN)) throw new Error('Invalid input');
        array = inputValues;
        renderArray(array);
        statusMessage.textContent = 'Custom array applied!';
        customArrayInput.style.display = 'none';
    } catch (e) {
        statusMessage.textContent = 'Please enter valid numbers separated by commas';
    }
});

saveProgressBtn.addEventListener('click', () => {
    trackProgress('mergesort', steps);
    statusMessage.textContent = 'Progress saved!';
});

document.getElementById('start-btn').addEventListener('click', async () => {
    steps = 0;
    comparisons = 0;
    arrayAccessCount = 0;
    renderArray(array);
    statusMessage.textContent = 'Sorting in progress...';
    
    const startTime = performance.now();
    await mergeSort(array);
    const endTime = performance.now();
    
    timeDisplay.textContent = `Time: ${formatTime(endTime - startTime)}`;
    playSound('complete');
    renderArray(array);
    statusMessage.textContent = 'Sorting completed!';
});

document.getElementById('pause-btn').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pause-btn').textContent = isPaused ? 'Resume' : 'Pause';
    statusMessage.textContent = isPaused ? 'Sorting paused' : 'Sorting resumed';
    
    if (!isPaused && resumeSort) {
        resumeSort();
    }
});

// Initial render
renderArray(array);