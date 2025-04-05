// Handles displaying error messages to the user

// Elements
const errorToast = document.querySelector('.error-toast');
const errorMessage = document.querySelector('.error-message');
const closeErrorBtn = document.querySelector('.close-error');

// Show error message
export function showError(message) {
    errorMessage.textContent = message;
    errorToast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide error message
export function hideError() {
    errorToast.classList.remove('show');
}

// Add event listener to close button
closeErrorBtn.addEventListener('click', hideError);
// API error handler
export function handleApiError(error, fallbackMessage = 'An error occurred. Please try again.') {
    console.error('API Error:', error);
    
    // Determine error message to display
    let message = fallbackMessage;
    
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message = `Error (${error.response.status}): ${error.response.data.message || 'Server error'}`;
    } else if (error.request) {
        // The request was made but no response was received
        message = 'Network error. Please check your connection.';
    } else {
        // Something happened in setting up the request that triggered an Error
        message = error.message || fallbackMessage;
    }
    
    // Show error message
    showError(message);
}

// Handle offline status
export function handleOfflineStatus() {
    const isOffline = !navigator.onLine;
    
    if (isOffline) {
        showError('You appear to be offline. Some features may not work properly.');
    }
    
    return isOffline;
}

// Setup offline/online event listeners
export function setupNetworkStatusListeners() {
    window.addEventListener('online', () => {
        hideError();
        showError('You are back online!');
        setTimeout(hideError, 3000);
    });
    
    window.addEventListener('offline', () => {
        showError('You are offline. Some features may not work properly.');
    });
}