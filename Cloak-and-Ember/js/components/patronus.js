// components/patronus.js
import { createPatronusCard } from './cards.js';

// Helper function to capitalize strings
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Patronus map
export let patronusMap = {};

// Setup Patronus map from characters
export function setupPatronusExplorer(characters) {
    patronusMap = {}; // Always reset first

    if (!Array.isArray(characters)) {
        console.error('Characters input is not an array:', characters);
        return;
    }

    characters.forEach(character => {
        if (character.patronus && character.patronus.trim() !== '') {
            const patronus = capitalize(character.patronus.trim());
            if (!patronusMap[patronus]) {
                patronusMap[patronus] = [];
            }
            patronusMap[patronus].push(character);
        }
    });

    console.log('Built patronusMap:', patronusMap); // Debug
}

// Render the Patronus Explorer page
export function renderPatronusExplorer() {
    const cardsGrid = document.querySelector('.cards-grid');
    const categoryTitle = document.querySelector('.category-title');
    const sortFilter = document.getElementById('sort-filter');
    const emptyState = document.querySelector('.empty-state');

    cardsGrid.innerHTML = ''; // Always clear
    categoryTitle.textContent = 'Patronus Explorer';
    if (sortFilter) sortFilter.style.display = 'none';
    if (emptyState) emptyState.classList.add('hidden');

    // If no Patronus data available
    if (!patronusMap || Object.keys(patronusMap).length === 0) {
        const message = document.createElement('div');
        message.className = 'no-results';
        message.textContent = 'No Patronus data available.';
        cardsGrid.appendChild(message);
        return;
    }

    // Otherwise render patronus buttons
    Object.keys(patronusMap).sort().forEach(patronus => {
        const button = document.createElement('button');
        button.className = 'patronus-button';
        button.textContent = `${patronus} (${patronusMap[patronus].length})`;

        button.addEventListener('click', () => {
            renderCharactersByPatronus(patronus, patronusMap[patronus]);
        });

        cardsGrid.appendChild(button);
    });
}

// Render characters for a selected patronus
function renderCharactersByPatronus(patronus, characters) {
    const cardsGrid = document.querySelector('.cards-grid');
    const categoryTitle = document.querySelector('.category-title');
    const sortFilter = document.getElementById('sort-filter');
    const emptyState = document.querySelector('.empty-state');

    cardsGrid.innerHTML = ''; // Clear
    categoryTitle.textContent = `${patronus} - Patronus Holders`;
    if (sortFilter) sortFilter.style.display = 'none';
    if (emptyState) emptyState.classList.add('hidden');

    if (!characters || characters.length === 0) {
        const message = document.createElement('div');
        message.className = 'no-results';
        message.textContent = `No known characters with a ${patronus} patronus.`;
        cardsGrid.appendChild(message);
        return;
    }

    // Render a card for each character
    characters.forEach(character => {
        const card = createPatronusCard(character, false, 'character');
        cardsGrid.appendChild(card);
    });
}
