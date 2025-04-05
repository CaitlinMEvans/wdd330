// Random Fact Component - Handles the random fact button functionality

// Elements
const randomFactButton = document.querySelector('.random-fact-button');

// Setup the random fact component
export function setupRandomFact(onRandomFactClick) {
    // Add click event listener to random fact button
    randomFactButton.addEventListener('click', () => {
        // Add animation class
        randomFactButton.classList.add('clicked');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            randomFactButton.classList.remove('clicked');
        }, 500);
        
        // Call the callback function
        onRandomFactClick();
    });
}