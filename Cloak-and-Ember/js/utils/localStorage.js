// Handles saving and retrieving data from localStorage
import { showError } from './errorHandling.js';

// Key for favorites in localStorage
const FAVORITES_KEY = 'hp_fact_file_favorites';

// Get favorites from localStorage
export function getFavorites() {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error getting favorites from localStorage:', error);
        showError('Could not retrieve favorites');
        return [];
    }
}

// Add item to favorites
export function addToFavorites(item) {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.id === item.id)) {
        favorites.push(item); // Push full object
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        showSuccessToast(`Added ${item.name || item.character || 'item'} to favorites`);
    } else {
        showError('This item is already in your favorites');
    }
}

// Remove item from favorites
export function removeFromFavorites(itemId) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.id !== itemId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    showSuccessToast('Removed from favorites');
}

// Check if an item is in favorites
export function isFavorite(itemId) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === itemId);
}

// Success toast function (add to errorHandling.js)
export function showSuccessToast(message) {
    const successToast = document.createElement('div');
    successToast.classList.add('success-toast');
    successToast.textContent = message;
    
    document.body.appendChild(successToast);
    
    // Animate in
    setTimeout(() => {
        successToast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successToast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(successToast);
        }, 500);
    }, 3000);
}