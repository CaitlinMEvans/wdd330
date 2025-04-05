// Handles saving and retrieving data from localStorage

// Key for favorites in localStorage
const FAVORITES_KEY = 'hp_fact_file_favorites';

// Get favorites from localStorage
export function getFavorites() {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error getting favorites from localStorage:', error);
        return [];
    }
}

// Add an item to favorites
export function addToFavorites(itemId) {
    try {
        const favorites = getFavorites();
        
        // Check if item is already in favorites
        if (!favorites.includes(itemId)) {
            favorites.push(itemId);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
    }
}

// Remove an item from favorites
export function removeFromFavorites(itemId) {
    try {
        let favorites = getFavorites();
        
        // Remove the item from the array
        favorites = favorites.filter(id => id !== itemId);
        
        // Update localStorage
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error removing from favorites:', error);
    }
}

// Check if an item is in favorites
export function isFavorite(itemId) {
    const favorites = getFavorites();
    return favorites.includes(itemId);
}

// Clear all favorites
export function clearFavorites() {
    try {
        localStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
        console.error('Error clearing favorites:', error);
    }
}

// Save last viewed category to localStorage
export function saveLastCategory(category) {
    try {
        localStorage.setItem('hp_fact_file_last_category', category);
    } catch (error) {
        console.error('Error saving last category:', error);
    }
}

// Get last viewed category from localStorage
export function getLastCategory() {
    try {
        return localStorage.getItem('hp_fact_file_last_category') || 'all';
    } catch (error) {
        console.error('Error getting last category:', error);
        return 'all';
    }
}

// Save theme preference to localStorage
export function saveThemePreference(theme) {
    try {
        localStorage.setItem('hp_fact_file_theme', theme);
    } catch (error) {
        console.error('Error saving theme preference:', error);
    }
}

// Get theme preference from localStorage
export function getThemePreference() {
    try {
        return localStorage.getItem('hp_fact_file_theme') || 'dark';
    } catch (error) {
        console.error('Error getting theme preference:', error);
        return 'dark';
    }
}