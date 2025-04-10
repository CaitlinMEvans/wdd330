// Navigation Component - Handles the category navigation functionality
import { getFavorites } from '../utils/localStorage.js'; 

// Elements
const categoryCards = document.querySelectorAll('.category-card');
const cardsGrid = document.querySelector('.cards-grid');
const categoryTitle = document.querySelector('.category-title');
const sortFilter = document.getElementById('sort-filter');

// Favorite rendering function
function renderFavoritesPage() {
    // Clear existing content
    cardsGrid.innerHTML = '';
    categoryTitle.textContent = 'Favorites';
    sortFilter.style.display = 'none'; // Hide sort filter for favorites

    // Get favorites from localStorage
    const favorites = getFavorites(); // ← This returns the full saved objects!

    if (favorites.length === 0) {
        const noFavoritesMessage = document.createElement('p');
        noFavoritesMessage.textContent = 'You have no favorites yet. Start adding some!';
        noFavoritesMessage.classList.add('no-favorites-message');
        cardsGrid.appendChild(noFavoritesMessage);
    } else {
        // Render favorites properly
        window.renderCards(cardsGrid, favorites, favorites.map(f => f.id), 'favorites');
    }
}

// Setup the navigation component
export function setupNavigation(onCategoryChange) {
    // Add click event listeners to category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Add selected animation class
            card.classList.add('selected');
            
            // Remove selected class after animation completes
            setTimeout(() => {
                card.classList.remove('selected');
            }, 500);
            
            // Restore sort filter
            if (sortFilter) {
                sortFilter.style.display = '';
            }
            
            // Special handling for favorites
            if (category === 'favorites') {
                renderFavoritesPage();
            } else {
                // Call the callback function for other categories
                onCategoryChange(category);
            }
        });
    });
}

// Get the current selected category
export function getCurrentCategory() {
    const activeCard = document.querySelector('.category-card.active');
    return activeCard ? activeCard.dataset.category : 'all';
}

// Programmatically select a category
export function selectCategory(category) {
    const card = document.querySelector(`.category-card[data-category="${category}"]`);
    
    if (card) {
        // Simulate a click on the card
        card.click();
    }
}

// Add a method to manually trigger favorites rendering if needed
export function showFavoritesPage() {
    renderFavoritesPage();
}