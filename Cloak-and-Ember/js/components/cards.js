// Cards Component - Handles rendering of cards in the grid

import { getHouseColorClass } from '../api/hpApi.js';
import { getSpellLightClass } from '../api/potterdbApi.js';

/**
 * Render all cards in the grid
 * @param {HTMLElement} cardsGrid - The container for the cards
 * @param {Array} items - Array of items to display as cards
 * @param {Array} favorites - Array of favorite item IDs
 * @param {string} category - Current category being displayed
 */
export function renderCards(cardsGrid, items, favorites, category) {
    // Clear the grid first
    cardsGrid.innerHTML = '';
    
    // Render each item as a card
    items.forEach(item => {
        const card = createCard(item, favorites.includes(item.id), category);
        cardsGrid.appendChild(card);
    });
}

/**
 * Create a card element for an item
 * @param {Object} item - The item data to display
 * @param {boolean} isFavorite - Whether the item is a favorite
 * @param {string} category - Current category being displayed
 * @returns {HTMLElement} - The card element
 */
function createCard(item, isFavorite, category) {
    const card = document.createElement('div');
    card.className = `card ${getCardTypeClass(item, category)}`;
    card.dataset.id = item.id;
    card.dataset.type = item.type;
    
    // Add house-specific class for characters
    if (item.type === 'character' && item.house) {
        card.classList.add(getHouseColorClass(item.house));
    }
    
    // Add light class for spells
    if (item.type === 'spell' && item.light) {
        card.classList.add(getSpellLightClass(item.light));
    }
    
    // Add favorite indicator if needed
    if (isFavorite) {
        const favoriteIndicator = document.createElement('div');
        favoriteIndicator.className = 'favorite-indicator';
        favoriteIndicator.innerHTML = '★';
        card.appendChild(favoriteIndicator);
    }
    
    // Create card content based on item type
    let cardContent = '';
    
    switch (item.type) {
        case 'character':
            cardContent = createCharacterCardContent(item);
            break;
        case 'spell':
            cardContent = createSpellCardContent(item);
            break;
        case 'potion':
            cardContent = createPotionCardContent(item);
            break;
        case 'quote':
            cardContent = createQuoteCardContent(item);
            break;
        default:
            cardContent = createDefaultCardContent(item);
    }
    
    card.innerHTML += cardContent;
    
    // Add click event listener directly to the card
    card.addEventListener('click', () => {
        // FIXED: Dispatch 'showModal' instead of 'openModal' to match modal.js listener
        document.dispatchEvent(new CustomEvent('showModal', {
            detail: {
                // FIXED: Pass the full item object instead of just ID
                item: item,
                type: item.type,
                isFavorite: isFavorite
            }
        }));
    });
    
    return card;
}

/**
 * Create content for a character card
 * @param {Object} character - Character data
 * @returns {string} - HTML content for the card
 */
function createCharacterCardContent(character) {
    const placeholderImage = character.house ? 
        `./assets/images/houses/${character.house.toLowerCase()}.webp` : 
        './assets/images/openbook.svg';
    
    const image = character.image || placeholderImage;
    
    return `
        <div class="card-image-container">
            <img src="${image}" alt="${character.name}" class="card-image" 
                 onerror="this.onerror=null; this.src='./assets/images/openbook.svg';">
            <div class="card-category-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L19 6.5V17.5L12 22L5 17.5V6.5L12 2Z" stroke="currentColor" stroke-width="1.5" />
                    <circle cx="12" cy="7" r="2" stroke="currentColor" stroke-width="1.5" />
                    <path d="M10 14H14L15 19H9L10 14Z" stroke="currentColor" stroke-width="1.5" />
                    <path d="M7 14C7 11.7909 9.23858 10 12 10C14.7614 10 17 11.7909 17 14" stroke="currentColor" stroke-width="1.5" />
                </svg>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${character.name}</h3>
            <p class="card-subtitle">${character.house || 'Unknown House'}</p>
            <div class="card-tags">
                ${character.hogwartsStudent ? '<span class="card-tag">Student</span>' : ''}
                ${character.hogwartsStaff ? '<span class="card-tag">Staff</span>' : ''}
                ${character.wizard ? '<span class="card-tag">Wizard</span>' : ''}
                ${character.ancestry ? `<span class="card-tag">${character.ancestry}</span>` : ''}
            </div>
        </div>
    `;
}

/**
 * Create content for a spell card
 * @param {Object} spell - Spell data
 * @returns {string} - HTML content for the card
 */
function createSpellCardContent(spell) {
    const lightClass = getSpellLightClass(spell.light);
    
    return `
        <div class="card-image-container">
            <div class="spell-visual ${lightClass}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spell-icon">
                    <path d="M5 2H19V8H5V2Z" stroke="currentColor" stroke-width="1.5" />
                    <path d="M12 8V22M12 22L8 18M12 22L16 18" stroke="currentColor" stroke-width="1.5" />
                    <path d="M5 5H8" stroke="currentColor" stroke-width="1.5" />
                    <path d="M5 8H19" stroke="currentColor" stroke-width="1.5" />
                </svg>
            </div>
            <div class="card-category-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" />
                    <path d="M12 17L16 12H13V7H11V12H8L12 17Z" fill="currentColor" />
                </svg>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${spell.name}</h3>
            <p class="card-subtitle">${spell.incantation || 'No incantation'}</p>
            <div class="card-tags">
                ${spell.type ? `<span class="card-tag">${spell.type}</span>` : ''}
                ${spell.light ? `<span class="card-tag"><span class="spell-light ${lightClass}"></span>${spell.light}</span>` : ''}
            </div>
        </div>
    `;
}

/**
 * Create content for a potion card
 * @param {Object} potion - Potion data
 * @returns {string} - HTML content for the card
 */
function createPotionCardContent(potion) {
    return `
        <div class="card-image-container">
            <div class="potion-visual">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="potion-icon">
                    <path d="M8 3H16V7.5C16 8.69 17 10 17 10L19 14C19 14 20 17 20 18C20 20 18 21 12 21C6 21 4 20 4 18C4 17 5 14 5 14L7 10C7 10 8 8.69 8 7.5V3Z" stroke="currentColor" stroke-width="1.5" />
                    <path d="M8 3C8 3 9 4 12 4C15 4 16 3 16 3" stroke="currentColor" stroke-width="1.5" />
                    <path d="M5 14H19" stroke="currentColor" stroke-width="1.5" />
                </svg>
            </div>
            <div class="card-category-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3H16V7.5C16 8.69 17 10 17 10L19 14C19 14 20 17 20 18C20 20 18 21 12 21C6 21 4 20 4 18C4 17 5 14 5 14L7 10C7 10 8 8.69 8 7.5V3Z" stroke="currentColor" stroke-width="1.5" />
                    <path d="M8 3C8 3 9 4 12 4C15 4 16 3 16 3" stroke="currentColor" stroke-width="1.5" />
                    <path d="M5 14H19" stroke="currentColor" stroke-width="1.5" />
                </svg>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${potion.name}</h3>
            <p class="card-subtitle">${potion.effect || 'Unknown effect'}</p>
            <div class="card-tags">
                ${potion.difficulty ? `<span class="card-tag">${potion.difficulty}</span>` : ''}
                ${potion.ingredients && potion.ingredients.length ? `<span class="card-tag">${potion.ingredients.length} ingredients</span>` : ''}
            </div>
        </div>
    `;
}

/**
 * Create content for a quote card
 * @param {Object} quote - Quote data
 * @returns {string} - HTML content for the card
 */
function createQuoteCardContent(quote) {
    // Handle different quote formats from different sources
    const quoteText = quote.text || quote.quote || '';
    const character = quote.character || quote.speaker || 'Unknown';
    
    return `
        <div class="card-image-container">
            <img src="${quote.image || ''}" alt="${character}" onerror="this.onerror=null; this.src='./assets/images/openbook.svg';">
            <div class="card-category-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4V17C4 18.6569 5.34315 20 7 20H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 10C9 8.89543 9.89543 8 11 8H19C20.1046 8 21 8.89543 21 10V16C21 17.1046 20.1046 18 19 18H11C9.89543 18 9 17.1046 9 16V10Z" stroke="currentColor" stroke-width="1.5" />
                </svg>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${character}</h3>
            <p class="card-subtitle quote-text">"${quoteText.length > 60 ? quoteText.substring(0, 60) + '...' : quoteText}"</p>
        </div>
    `;
}

/**
 * Create default content for a card
 * @param {Object} item - Item data
 * @returns {string} - HTML content for the card
 */
function createDefaultCardContent(item) {
    return `
        <div class="card-image-container">
            <div class="default-visual"></div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${item.name || 'Unknown'}</h3>
            <p class="card-subtitle">${item.type || 'Item'}</p>
        </div>
    `;
}

/**
 * Get CSS class for card based on item type
 * @param {Object} item - Item data
 * @param {string} category - Current category
 * @returns {string} - CSS class for the card
 */
function getCardTypeClass(item, category) {
    switch (item.type) {
        case 'character':
            return 'character-card';
        case 'spell':
            return 'spell-card';
        case 'potion':
            return 'potion-card';
        case 'quote':
            return 'quote-card';
        default:
            return '';
    }
}