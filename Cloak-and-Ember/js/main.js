// main.js - Entry point for the application

import { loadCategories } from './components/CategoryRenderer.mjs';
import { setupModal } from './components/Modal.mjs';
import { setupRandomFactButton } from './components/RandomFact.mjs';
import { setupMobileMenu } from './utils/helpers.mjs';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        console.log('Initializing Cloak and Ember application...');
        
        // Set up the mobile menu
        setupMobileMenu();
        
        // Set up the modal functionality
        setupModal();
        
        // Load the categories on the homepage
        if (document.querySelector('.category-grid')) {
            await loadCategories();
        }
        
        // Set up the random fact button
        const randomFactBtn = document.getElementById('randomFactBtn');
        if (randomFactBtn) {
            setupRandomFactButton(randomFactBtn);
        }
        
        // Load page-specific content based on the current page
        loadPageSpecificContent();
        
        console.log('Application initialized successfully!');
    } catch (error) {
        console.error('Error initializing application:', error);
        // Display a user-friendly error message
        showErrorMessage('Failed to initialize the application. Please try again later.');
    }
}

function loadPageSpecificContent() {
    // Get the current page from the URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // Load content based on the current page
    switch (currentPage) {
        case 'characters.html':
            import('./pages/characters.mjs').then(module => {
                module.initCharactersPage();
            }).catch(error => {
                console.error('Error loading characters page:', error);
                showErrorMessage('Failed to load characters data. Please try again later.');
            });
            break;
            
        case 'spells.html':
            import('./pages/spells.mjs').then(module => {
                module.initSpellsPage();
            }).catch(error => {
                console.error('Error loading spells page:', error);
                showErrorMessage('Failed to load spells data. Please try again later.');
            });
            break;
            
        case 'potions.html':
            import('./pages/potions.mjs').then(module => {
                module.initPotionsPage();
            }).catch(error => {
                console.error('Error loading potions page:', error);
                showErrorMessage('Failed to load potions data. Please try again later.');
            });
            break;
            
        case 'quotes.html':
            import('./pages/quotes.mjs').then(module => {
                module.initQuotesPage();
            }).catch(error => {
                console.error('Error loading quotes page:', error);
                showErrorMessage('Failed to load quotes data. Please try again later.');
            });
            break;
            
        case 'index.html':
        case '':
            // Homepage content is already loaded in the init function
            loadFeaturedContent();
            break;
            
        default:
            console.log('Unknown page or homepage');
            break;
    }
}

async function loadFeaturedContent() {
    try {
        // Load featured content for the homepage
        const featuredCardsContainer = document.querySelector('.featured-cards');
        if (featuredCardsContainer) {
            // Show loader
            featuredCardsContainer.innerHTML = '<div class="loader"></div>';
            
            // Import the CardRenderer
            const { renderCards } = await import('./components/CardRenderer.mjs');
            
            // Import the API modules
            const { getRandomCharacters } = await import('./api/hpApi.mjs');
            const { getRandomSpells } = await import('./api/wizardWorldApi.mjs');
            
            // Get random data for featured cards
            const characters = await getRandomCharacters(2);
            const spells = await getRandomSpells(2);
            
            // Combine the data and format it for the card renderer
            const featuredItems = [
                ...characters.map(char => ({
                    id: char.id,
                    name: char.name,
                    image: char.image || 'images/placeholder-character.jpg',
                    type: 'character',
                    house: char.house || 'Unknown',
                    description: `${char.hogwartsStudent ? 'Student' : char.hogwartsStaff ? 'Staff' : 'Character'} • ${char.house || 'Unknown House'}`
                })),
                ...spells.map(spell => ({
                    id: spell.id,
                    name: spell.name,
                    image: 'images/placeholder-spell.jpg',
                    type: 'spell',
                    light: spell.light || 'Unknown',
                    description: `${spell.type || 'Spell'} • ${spell.effect || 'Unknown effect'}`
                }))
            ];
            
            // Render the featured cards
            renderCards(featuredItems, featuredCardsContainer);
        }
    } catch (error) {
        console.error('Error loading featured content:', error);
        const featuredCardsContainer = document.querySelector('.featured-cards');
        if (featuredCardsContainer) {
            showErrorMessage('Failed to load featured content. Please try again later.', featuredCardsContainer);
        }
    }
}

function showErrorMessage(message, container = null) {
    // If a container is provided, show the error message in that container
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="btn btn-secondary retry-btn">Retry</button>
            </div>
        `;
        
        // Add event listener to the retry button
        const retryBtn = container.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                init();
            });
        }
    } else {
        // Otherwise, show a notification at the top of the page
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <p>${message}</p>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Automatically remove the notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
        
        // Allow the user to close the notification manually
        const closeBtn = notification.querySelector('.close-notification');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.classList.add('hiding');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            });
        }
    }
}