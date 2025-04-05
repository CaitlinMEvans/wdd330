// Navigation Component - Handles the category navigation functionality

// Elements
const categoryCards = document.querySelectorAll('.category-card');

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
            
            // Call the callback function
            onCategoryChange(category);
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