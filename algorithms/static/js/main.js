// Utility functions for algorithm visualizations
import { Howl } from './howler.js';

// Sound effects configuration
const sounds = {
    swap: new Howl({ src: ['/static/sounds/swap.mp3'] }),
    compare: new Howl({ src: ['/static/sounds/compare.mp3'] }),
    complete: new Howl({ src: ['/static/sounds/complete.mp3'] }),
    default: new Howl({ src: ['/static/sounds/default.mp3'] })
};

/**
 * Plays a sound effect for algorithm steps
 * @param {string} type - Type of sound ('swap', 'compare', 'complete')
 */
function playSound(type = 'default') {
    sounds[type].play();
}

/**
 * Tracks progress of algorithm execution
 * @param {string} algorithm - Name of algorithm
 * @param {number} steps - Number of steps completed
 */
function trackProgress(algorithm, steps) {
    const progress = localStorage.getItem('algorithmProgress') || {};
    progress[algorithm] = steps;
    localStorage.setItem('algorithmProgress', JSON.stringify(progress));
    console.log(`${algorithm}: ${steps} steps completed`);
}

/**
 * Generates a random array for visualization
 * @param {number} size - Size of array to generate
 * @returns {Array} - Generated array
 */
function generateRandomArray(size = 10) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 50) + 10);
}

/**
 * Formats time for display
 * @param {number} ms - Time in milliseconds
 * @returns {string} - Formatted time string
 */
function formatTime(ms) {
    return ms < 1000 ? `${ms}ms` : `${(ms/1000).toFixed(2)}s`;
}

function getProgress(algorithm) {
    const progress = JSON.parse(localStorage.getItem('algorithmProgress') || '{}');
    return progress[algorithm] || 0;
}

/**
 * Creates a delay for visualization purposes
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { playSound, trackProgress, generateRandomArray, formatTime, getProgress, sleep };