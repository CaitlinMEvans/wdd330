// Cards Component - Handles rendering of cards in the grid

import { getHouseColorClass } from '../api/hpApi.js';
import { getSpellLightClass } from '../api/potterdbApi.js';

/**
 * Render all cards in the grid
 */
export function renderCards(container, items, favorites, category) {
    // Clear the container first
    container.innerHTML = '';
    
    // Render each item as a card
    items.forEach(item => {
        const card = createCard(item, favorites.includes(item.id), category);
        container.appendChild(card);
    });
    
    window.renderCards = renderCards;
}

/**
 * Create a card element for an item
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
        case 'book':
            cardContent = createBookCardContent(item); 
            break;
        case 'movie':
            cardContent = createMovieCardContent(item);
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
               <svg
                class="icons"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  d="M64 416L168.6 180.7c15.3-34.4 40.3-63.5 72-83.7l146.9-94c3-1.9 6.5-2.9 10-2.9C407.7 0 416 8.3 416 18.6l0 1.6c0 2.6-.5 5.1-1.4 7.5L354.8 176.9c-1.9 4.7-2.8 9.7-2.8 14.7c0 5.5 1.2 11 3.4 16.1L448 416l-207.1 0 11.8-35.4 40.4-13.5c6.5-2.2 10.9-8.3 10.9-15.2s-4.4-13-10.9-15.2l-40.4-13.5-13.5-40.4C237 276.4 230.9 272 224 272s-13 4.4-15.2 10.9l-13.5 40.4-40.4 13.5C148.4 339 144 345.1 144 352s4.4 13 10.9 15.2l40.4 13.5L207.1 416 64 416zM279.6 141.5c-1.1-3.3-4.1-5.5-7.6-5.5s-6.5 2.2-7.6 5.5l-6.7 20.2-20.2 6.7c-3.3 1.1-5.5 4.1-5.5 7.6s2.2 6.5 5.5 7.6l20.2 6.7 6.7 20.2c1.1 3.3 4.1 5.5 7.6 5.5s6.5-2.2 7.6-5.5l6.7-20.2 20.2-6.7c3.3-1.1 5.5-4.1 5.5-7.6s-2.2-6.5-5.5-7.6l-20.2-6.7-6.7-20.2zM32 448l448 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                />
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
 */
function createSpellCardContent(spell) {
    const lightClass = getSpellLightClass(spell.light);
    
    return `
        <div class="card-image-container">
            <div class="spell-visual ${lightClass}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="spell-icon" fill="none">
                <path d="M224 96l32-64 32 64 64 32-64 32-32 64-32-64-64-32 64-32zm352 64l32-64 32 64 64 32-64 32-32 64-32-64-64-32 64-32zM96 320l32-64 32 64 64 32-64 32-32 64-32-64-64-32 64-32zM629.66 205.66l-23.32-23.32c-12.5-12.5-32.76-12.5-45.26 0l-494 494c-12.5 12.5-12.5 32.76 0 45.26l23.32 23.32c12.5 12.5 32.76 12.5 45.26 0l494-494c12.5-12.5 12.5-32.76 0-45.26z" 
                        fill="currentColor"/>
                </svg>
            </div>
            <div class="card-category-icon">
              <svg
                class="icons"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path
                  d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
                />
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
                <!-- BUBBLES-->
                <div class="bubble-container">
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                    <span class="bubble"></span>
                </div>
            </div>
            <div class="card-category-icon">
              <svg
                class="icons"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  d="M0 96C0 43 43 0 96 0L384 0l32 0c17.7 0 32 14.3 32 32l0 320c0 17.7-14.3 32-32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0L96 512c-53 0-96-43-96-96L0 96zM64 416c0 17.7 14.3 32 32 32l256 0 0-64L96 384c-17.7 0-32 14.3-32 32zM320 112c0-35.3-35.8-64-80-64s-80 28.7-80 64c0 20.9 12.6 39.5 32 51.2l0 12.8c0 8.8 7.2 16 16 16l64 0c8.8 0 16-7.2 16-16l0-12.8c19.4-11.7 32-30.3 32-51.2zM208 96a16 16 0 1 1 0 32 16 16 0 1 1 0-32zm48 16a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM134.3 209.3c-8.1-3.5-17.5 .3-21 8.4s.3 17.5 8.4 21L199.4 272l-77.7 33.3c-8.1 3.5-11.9 12.9-8.4 21s12.9 11.9 21 8.4L240 289.4l105.7 45.3c8.1 3.5 17.5-.3 21-8.4s-.3-17.5-8.4-21L280.6 272l77.7-33.3c8.1-3.5 11.9-12.9 8.4-21s-12.9-11.9-21-8.4L240 254.6 134.3 209.3z"
                />
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
 */
function createQuoteCardContent(quote) {
    // Handle different quote formats from different sources
    const quoteText = quote.text || quote.quote || '';
    const character = quote.character || quote.speaker || 'Unknown';
    
    return `
        <div class="card-image-container">
            <img class="card-image" src="${quote.image || ''}" alt="${character}" onerror="this.onerror=null; this.src='./assets/images/openbook.svg';">
            <div class="card-category-icon">
              <svg
                class="icons"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5l88 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0-72 0s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440l0 16c0 13.3 10.7 24 24 24s24-10.7 24-24l0-16c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"
                />
              </svg>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${character}</h3>
            <p class="house-badge quote-text">"${quoteText.length > 220 ? quoteText.substring(0, 220) + '...' : quoteText}"</p>
        </div>
    `;
}

/**
 * Exported createCard function for Patronus Explorer
 */
export function createPatronusCard(character) {
    const card = document.createElement('div');
    card.className = `card character-card ${character.house ? getHouseColorClass(character.house) : ''}`;
    card.dataset.id = character.id;
    card.dataset.type = 'character';

    const placeholderImage = character.house ? 
        `./assets/images/houses/${character.house.toLowerCase()}.webp` : 
        './assets/images/openbook.svg';
    
    const image = character.image || placeholderImage;

    card.innerHTML = `
        <div class="card-image-container">
            <img src="${image}" alt="${character.name}" class="card-image" 
                 onerror="this.onerror=null; this.src='./assets/images/openbook.svg';">
            <div class="card-category-icon">
              <svg class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M64 416L168.6 180.7c15.3-34.4 40.3-63.5 72-83.7l146.9-94c3-1.9 6.5-2.9 10-2.9C407.7 0 416 8.3 416 18.6v1.6c0 2.6-.5 5.1-1.4 7.5L354.8 176.9c-1.9 4.7-2.8 9.7-2.8 14.7 0 5.5 1.2 11 3.4 16.1L448 416H240l11.8-35.4 40.4-13.5c6.5-2.2 10.9-8.3 10.9-15.2s-4.4-13-10.9-15.2l-40.4-13.5-13.5-40.4C237 276.4 230.9 272 224 272s-13 4.4-15.2 10.9l-13.5 40.4-40.4 13.5c-6.5 2.2-10.9 8.3-10.9 15.2s4.4 13 10.9 15.2l40.4 13.5L207.1 416H64z"/>
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

    // Add click event listener to show modal (optional)
    card.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('showModal', {
            detail: {
                item: character,
                type: 'character',
                isFavorite: false
            }
        }));
    });

    return card;
}


/**
 * Create default content for a card
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