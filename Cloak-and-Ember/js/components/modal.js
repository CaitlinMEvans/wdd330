// modal.js - Handles the modal component for displaying detailed information
import { addToFavorites, removeFromFavorites } from '../utils/localStorage.js'; 

// Modal elements
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalContent = document.querySelector('.modal-content');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const favoriteBtn = document.querySelector('.favorite-btn');

// Current modal item
let currentItem = null;

// Content renderer map for different item types
const contentRenderers = {
    character: renderCharacterContent,
    spell: renderSpellContent,
    potion: renderPotionContent,
    quote: renderQuoteContent
};

// Setup modal behavior and event listeners
export function setupModal(onFavoriteToggle) {
    // Close modal when clicking the close button
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal
    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            closeModal();
        }
    });
    
    favoriteBtn.addEventListener('click', () => {
        if (currentItem) {
            const isFavorite = favoriteBtn.classList.contains('active');
            
            // Determine the type based on the current item's properties
            const itemType = currentItem.species ? 'character' : 
                            currentItem.effect ? 'spell' :
                            currentItem.quote ? 'quote' : 
                            'unknown';
            
            if (isFavorite) {
                // Remove from favorites
                removeFromFavorites(currentItem.id);
            } else {
                // Add to favorites
                const favoriteItem = {
                    ...currentItem,
                    type: itemType
                };
                addToFavorites(favoriteItem);
            }
            
            // Toggle the button state
            toggleFavoriteButton(!isFavorite);
            const favoriteItemId = currentItem.id;
            addToFavorites(favoriteItemId);
        }
    });

    // Listen for custom event to show modal
    document.addEventListener('showModal', (event) => {
        const { item, type, isFavorite } = event.detail;
        showModal(item, type, isFavorite);
    });
}

// Show the modal with item details
function showModal(item, itemType, isFavorite = false) {
    if (!item) return;
    
    // Store current item and set title
    currentItem = item;
    modalTitle.textContent = item.name || item.character || item.speaker || '';
    
    // Clear previous content
    modalContent.innerHTML = '';
    
    // Set content based on item type
    const renderContent = contentRenderers[itemType] || (() => {
        modalContent.innerHTML = '<p>Details not available</p>';
    });
    
    renderContent(item);
    
    // Set favorite state
    toggleFavoriteButton(isFavorite);
    
    // Show the modal with animation
    modalContainer.classList.add('show');
    setTimeout(() => {
        modal.classList.add('animate-in');
    }, 10);
}

// Close the modal
export function closeModal() {
    modal.classList.remove('animate-in');
    
    // Delay removing the show class for animation to complete
    setTimeout(() => {
        modalContainer.classList.remove('show');
        currentItem = null;
    }, 300);
}

// Toggle favorite button state
function toggleFavoriteButton(isFavorite) {
    if (isFavorite) {
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.classList.remove('active');
    }
}

// Create a detail item DOM element
function createDetailItem(label, value) {
    if (!value || value === 'Unknown' || value === '') return null;
    
    const detailElement = document.createElement('div');
    detailElement.classList.add('detail-item');
    
    const labelElement = document.createElement('span');
    labelElement.classList.add('detail-label');
    labelElement.textContent = label + ':';
    
    const valueElement = document.createElement('span');
    valueElement.classList.add('detail-value');
    valueElement.textContent = value;
    
    detailElement.appendChild(labelElement);
    detailElement.appendChild(valueElement);
    
    return detailElement;
}

// Create image container for modal
function createImageContainer(src, alt, extraClass = null) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('modal-image-container');
    
    const image = document.createElement('img');
    image.src = src || './assets/images/openbook.svg';
    image.alt = alt || 'Image';
    image.classList.add('modal-image');
    image.onerror = () => { image.src = './assets/images/openbook.svg'; };
    
    imageContainer.appendChild(image);
    
    // Add extra element if class is provided
    if (extraClass) {
        const extraElement = document.createElement('div');
        extraElement.classList.add(extraClass);
        imageContainer.appendChild(extraElement);
    }
    
    return imageContainer;
}

// Render character content
function renderCharacterContent(character) {
    const content = document.createElement('div');
    content.classList.add('character-details');
    
    // Add character image
    const imageContainer = createImageContainer(character.image, character.name);
    
    // Add house badge if available
    // if (character.house) {
    //     const houseBadge = document.createElement('div');
    //     houseBadge.classList.add('house-badge', `house-${character.house.toLowerCase()}`);
    //     houseBadge.textContent = character.house;
    //     imageContainer.appendChild(houseBadge);
    // }

    if (character.house) {
        const houseBadge = document.createElement('div');
        houseBadge.classList.add('house-badge', `house-${character.house.toLowerCase()}`);
        houseBadge.textContent = character.house;
        imageContainer.appendChild(houseBadge);
    }
    
    content.appendChild(imageContainer);
    
    // Create info section
    const infoSection = document.createElement('div');
    infoSection.classList.add('modal-info-section');
    
    // Add character details
    const details = [
        { label: 'House', value: character.house || 'Unknown' },
        { label: 'Role', value: character.hogwartsStudent ? 'Student' : character.hogwartsStaff ? 'Staff' : 'Other' },
        { label: 'Species', value: character.species || 'Unknown' },
        { label: 'Blood Status', value: character.ancestry || 'Unknown' },
        { label: 'Wand', value: formatWandDetails(character.wand) },
        { label: 'Patronus', value: character.patronus || 'Unknown' }
    ];
    
    details.forEach(detail => {
        const detailElement = createDetailItem(detail.label, detail.value);
        if (detailElement) infoSection.appendChild(detailElement);
    });
    
    content.appendChild(infoSection);
    modalContent.appendChild(content);
}

// Format wand details 
function formatWandDetails(wand) {
    if (!wand || !wand.wood) return 'Unknown';
    
    let details = wand.wood;
    if (wand.core) details += `, ${wand.core}`;
    if (wand.length) details += `, ${wand.length} inches`;
    
    return details;
}

// Render spell content
function renderSpellContent(spell) {
    const content = document.createElement('div');
    content.classList.add('spell-details');
    
    // Add spell visual
    const spellVisual = document.createElement('div');
    spellVisual.classList.add('spell-visual');
    
    const spellWand = document.createElement('div');
    spellWand.classList.add('wand');
    
    const spellLight = document.createElement('div');
    spellLight.classList.add('spell-light', getSpellLightClass(spell.light));
    
    spellWand.appendChild(spellLight);
    spellVisual.appendChild(spellWand);
    content.appendChild(spellVisual);
    
    // Create info section
    const infoSection = document.createElement('div');
    infoSection.classList.add('modal-info-section');
    
    // Add spell details
    const details = [
        { label: 'Incantation', value: spell.incantation || 'Non-verbal' },
        { label: 'Effect', value: spell.effect || 'Unknown' },
        { label: 'Type', value: spell.type || 'Unknown' },
        { label: 'Light', value: spell.light || 'Unknown' }
    ];
    
    details.forEach(detail => {
        const detailElement = createDetailItem(detail.label, detail.value);
        if (detailElement) infoSection.appendChild(detailElement);
    });
    
    content.appendChild(infoSection);
    modalContent.appendChild(content);
}

// Render potion content
function renderPotionContent(potion) {
    const content = document.createElement('div');
    content.classList.add('potion-details');
    
    // Add potion visual
    const potionVisual = document.createElement('div');
    potionVisual.classList.add('potion-visual');
    
    const potionBottle = document.createElement('div');
    potionBottle.classList.add('potion-bottle');
    
    if (potion.color) {
        potionBottle.style.setProperty('--potion-color', potion.color);
    }
    
    potionVisual.appendChild(potionBottle);
    content.appendChild(potionVisual);
    
    // Create info section
    const infoSection = document.createElement('div');
    infoSection.classList.add('modal-info-section');
    
    // Add potion details
    const details = [
        { label: 'Effect', value: potion.effect || 'Unknown' },
        { label: 'Characteristics', value: potion.characteristics || 'Unknown' },
        { label: 'Difficulty', value: potion.difficulty || 'Unknown' },
        { label: 'Time', value: potion.time || 'Unknown' }
    ];
    
    details.forEach(detail => {
        const detailElement = createDetailItem(detail.label, detail.value);
        if (detailElement) infoSection.appendChild(detailElement);
    });
    
    // Add ingredients if available
    if (potion.ingredients && potion.ingredients.length > 0) {
        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('ingredients-container');
        
        const ingredientsLabel = document.createElement('h3');
        ingredientsLabel.textContent = 'Ingredients:';
        ingredientsContainer.appendChild(ingredientsLabel);
        
        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');
        
        potion.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = ingredient.name;
            ingredientsList.appendChild(ingredientItem);
        });
        
        ingredientsContainer.appendChild(ingredientsList);
        infoSection.appendChild(ingredientsContainer);
    }
    
    content.appendChild(infoSection);
    modalContent.appendChild(content);
}

// Render quote content 
function renderQuoteContent(quote) {
    const content = document.createElement('div');
    content.classList.add('quote-details');
    
    // Add quote image/character image
    const imageContainer = createImageContainer(
        quote.image,
        quote.character || quote.speaker || 'Unknown'
    );
    content.appendChild(imageContainer);
    
    // Create quote section
    const quoteSection = document.createElement('div');
    quoteSection.classList.add('quote-section');
    
    // The actual quote text
    const quoteText = document.createElement('blockquote');
    quoteText.classList.add('quote-text');
    quoteText.textContent = quote.text || quote.quote || '';
    
    // Add a fancy quote mark
    const quoteIcon = document.createElement('span');
    quoteIcon.classList.add('quote-icon');
    quoteIcon.innerHTML = '"';
    quoteText.prepend(quoteIcon);
    
    quoteSection.appendChild(quoteText);
    
    // Speaker attribution
    const speaker = document.createElement('div');
    speaker.classList.add('quote-speaker');
    speaker.textContent = `— ${quote.character || quote.speaker || 'Unknown'}`;
    quoteSection.appendChild(speaker);
    
    // Source information
    if (quote.story || quote.source) {
        const source = document.createElement('div');
        source.classList.add('quote-source');
        source.textContent = `${quote.story || ''} ${quote.source ? `(${quote.source})` : ''}`;
        quoteSection.appendChild(source);
    }
    
    content.appendChild(quoteSection);
    modalContent.appendChild(content);
    
    // Update modal title to be the character's name
    modalTitle.textContent = quote.character || quote.speaker || 'Wizarding Quote';
}

// Helper function to get spell light class
function getSpellLightClass(light) {
    if (!light) return 'light-blue';
    
    const lightMap = {
        'red': 'light-red',
        'green': 'light-green',
        'blue': 'light-blue',
        'white': 'light-white',
        'purple': 'light-purple',
        'yellow': 'light-yellow',
        'orange': 'light-orange'
    };
    
    const lightLower = light.toLowerCase();
    return lightMap[lightLower] || 'light-blue';
}