// Main JavaScript file for AlgoVerse

document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    if (flashMessages.length > 0) {
        setTimeout(() => {
            flashMessages.forEach(message => {
                message.style.opacity = '0';
                setTimeout(() => {
                    message.style.display = 'none';
                }, 500);
            });
        }, 5000);
    }

    // Add sound effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            playSound('click');
        });
    });
});

// Function to play sound effects
function playSound(soundName) {
    try {
        const sound = new Audio(`/static/sounds/${soundName}.mp3`);
        sound.volume = 0.3;
        sound.play();
    } catch (error) {
        console.log('Sound could not be played:', error);
    }
}

// Function to update user progress
function saveProgress(algorithm, progress) {
    fetch('/save_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            algorithm: algorithm,
            progress: progress
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Progress saved:', data);
    })
    .catch(error => {
        console.error('Error saving progress:', error);
    });
}

// Function to get user progress
function getProgress(algorithm, callback) {
    fetch(`/get_progress/${algorithm}`)
        .then(response => response.json())
        .then(data => {
            callback(data.progress);
        })
        .catch(error => {
            console.error('Error getting progress:', error);
            callback(null);
        });
}

// Helper function to create a delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}