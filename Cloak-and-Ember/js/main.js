// Main.js - Entry point for Harry Potter Fact File Application

import { fetchCharacters, fetchStudents, fetchStaff } from './api/hpApi.js';
import { fetchSpells, fetchPotions } from './api/potterdbApi.js';
import { fetchQuotes } from './api/quotesApi.js';
import { fetchWWSpells, fetchWWElixirs, fetchWWWizards } from './api/wizardWorldApi.js';

import { renderCards } from './components/cards.js';
import { setupModal } from './components/modal.js';
import { setupNavigation } from './components/navigation.js';
import { setupRandomFact } from './components/randomFact.js';

import { getFavorites, addToFavorites, removeFromFavorites } from './utils/localStorage.js';
import { showError, hideError } from './utils/errorHandling.js';
import { filterAndSortItems } from './utils/helpers.js';

// Elements
const cardsGrid = document.querySelector('.cards-grid');
const loadingContainer = document.querySelector('.loading-container');
const categoryTitle = document.querySelector('.category-title');
const sortFilter = document.getElementById('sort-filter');
const emptyState = document.querySelector('.empty-state');

// Category title mapping
const CATEGORY_TITLES = {
  'all': 'Cloak and Ember Facts',
  'characters': 'Characters',
  'spells': 'Spells',
  'potions': 'Plants & Potions',
  'quotes': 'Quotes'
};

// Application state
const appState = {
    currentCategory: 'all',
    allData: {
        characters: [],
        students: [],
        staff: [],
        spells: [],
        potions: [],
        quotes: []
    },
    filteredData: [],
    favorites: [],
    sortOption: 'name-asc',
    isLoading: false
};

// Initialize the application
async function initApp() {
    try {
        // Get favorites from local storage
        appState.favorites = getFavorites();

        // Setup components
        setupEventListeners();
        setupNavigation(changeCategory);
        setupModal(handleFavoriteToggle);
        setupRandomFact(showRandomFact);

        // Initial load and render
        await loadAllData();
        await changeCategory('all');
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize application. Please refresh the page.');
    }
}

// Setup event listeners
function setupEventListeners() {
    sortFilter.addEventListener('change', event => {
        appState.sortOption = event.target.value;
        renderCurrentCategory();
    });
}

// Load all data from APIs with Promise.allSettled
async function loadAllData() {
    showLoading();
    
    try {
        // Fetch all data sources
        const results = await Promise.allSettled([
            fetchCharacters(),
            fetchStudents(),
            fetchStaff(),
            fetchSpells(),
            fetchPotions(),
            fetchQuotes(),
            fetchWWSpells(),
            fetchWWElixirs(),
            fetchWWWizards()
        ]);
        
        // Process results
        const [
            charactersResult, 
            studentsResult, 
            staffResult, 
            spellsResult, 
            potionsResult, 
            quotesResult,
            wwSpellsResult,
            wwElixirsResult,
            wwWizardsResult
        ] = results;
        
        // Extract values or use empty arrays for failed requests
        const characters = charactersResult.status === 'fulfilled' ? charactersResult.value : [];
        const students = studentsResult.status === 'fulfilled' ? studentsResult.value : [];
        const staff = staffResult.status === 'fulfilled' ? staffResult.value : [];
        let spells = spellsResult.status === 'fulfilled' ? spellsResult.value : [];
        let potions = potionsResult.status === 'fulfilled' ? potionsResult.value : [];
        const quotes = quotesResult.status === 'fulfilled' ? quotesResult.value : [];
        
        // Process Wizard World data
        if (wwWizardsResult.status === 'fulfilled') {
            const wizards = wwWizardsResult.value;
            // Store for global access
            window.wizardWorldWizardsCache = wizards;
            // Add unique wizards to characters
            mergeUniqueItems(characters, wizards, 'name');
        }
        
        // Merge spell data from both APIs
        if (wwSpellsResult.status === 'fulfilled') {
            const wwSpells = wwSpellsResult.value;
            if (spellsResult.status === 'fulfilled') {
                // Add unique spells from Wizard World
                mergeUniqueItems(spells, wwSpells, 'name');
            } else {
                // Use Wizard World spells if Potter DB failed
                spells = wwSpells;
            }
        }
        
        // Merge potion/elixir data from both APIs
        if (wwElixirsResult.status === 'fulfilled') {
            const wwElixirs = wwElixirsResult.value;
            if (potionsResult.status === 'fulfilled') {
                // Add unique elixirs from Wizard World
                mergeUniqueItems(potions, wwElixirs, 'name');
            } else {
                // Use Wizard World elixirs if Potter DB failed
                potions = wwElixirs;
            }
        }
        
        // Update app state with all data
        appState.allData = {
            characters,
            students,
            staff,
            spells,
            potions,
            quotes
        };
        
        // Store data in window for global access
        window.appQuotes = quotes;
        window.appState = appState;
        
        // Check for API failures
        const failedApis = results.filter(result => result.status === 'rejected');
        if (failedApis.length > 0) {
            console.error('Some APIs failed to load:', failedApis);
            showError('Some magical data could not be loaded. Limited functionality available.');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load magical data. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Merge unique items from source into target based on property
function mergeUniqueItems(target, source, property) {
    if (!Array.isArray(source) || !Array.isArray(target)) return;
    
    const existingValues = new Set(target.map(item => 
        item[property]?.toLowerCase?.() || item[property]
    ));
    
    source.forEach(item => {
        const value = item[property]?.toLowerCase?.() || item[property];
        if (!existingValues.has(value)) {
            target.push(item);
        }
    });
}

// Change the current category
async function changeCategory(category) {
    try {
        showLoading();
        appState.currentCategory = category;
        
        // Update category title
        categoryTitle.textContent = CATEGORY_TITLES[category] || 'Cloak and Ember Facts';
        
        // Render the current category
        renderCurrentCategory();
    } catch (error) {
        console.error('Error changing category:', error);
        showError('Failed to change category. Please try again.');
    } finally {
        hideLoading();
    }
}

// Render the current category
function renderCurrentCategory() {
    try {
        // Get data for the current category
        const dataToRender = getCategoryData(appState.currentCategory);
        
        // Filter and sort the data
        appState.filteredData = filterAndSortItems(dataToRender, appState.sortOption);
        
        // Show empty state or render cards
        if (appState.filteredData.length === 0) {
            showEmptyState();
        } else {
            hideEmptyState();
            renderCards(cardsGrid, appState.filteredData, appState.favorites, appState.currentCategory);
        }
    } catch (error) {
        console.error('Error rendering category:', error);
        showError('Failed to render items. Please try again.');
    }
}

// Get data for a specific category
function getCategoryData(category) {
    const { characters, spells, potions, quotes } = appState.allData;
    
    switch (category) {
        case 'all':
            return [
                ...characters.slice(0, 10),
                ...spells.slice(0, 5),
                ...potions.slice(0, 5),
                ...quotes.slice(0, 5)
            ];
        case 'characters':
            return characters;
        case 'spells':
            return spells;
        case 'potions':
            return potions;
        case 'quotes':
            return quotes;
        default:
            return [];
    }
}

// Get a specific quote by ID (for modal)
// Not able to get by ID working.. skipping for other tasks. 
function getQuoteById(id) {
    try {
        // Try window.appQuotes first
        if (window.appQuotes) {
            const quote = window.appQuotes.find(q => q.id === id);
            if (quote) return quote;
        }
        
        // Then try appState
        if (appState.allData.quotes) {
            return appState.allData.quotes.find(q => q.id === id);
        }
        
        return null;
    } catch (error) {
        console.error('Error finding quote:', error);
        return null;
    }
}

// Show a random fact
function showRandomFact() {
    try {
        // Get all available data
        const allData = [
            ...appState.allData.characters,
            ...appState.allData.spells,
            ...appState.allData.potions,
            ...appState.allData.quotes
        ];
        
        if (allData.length === 0) {
            showError("No magical facts available yet!");
            return;
        }

        // Select a random item
        const randomIndex = Math.floor(Math.random() * allData.length);
        const randomItem = allData[randomIndex];
        
        // Show the modal
        document.dispatchEvent(new CustomEvent('showModal', {
            detail: {
                item: randomItem,
                type: randomItem.type || 'unknown',
                isFavorite: appState.favorites.includes(randomItem.id)
            }
        }));
    } catch (error) {
        console.error('Error showing random fact:', error);
        showError('Failed to show random fact. Please try again.');
    }
}

// Handle favorite toggle
function handleFavoriteToggle(item, isFavorite) {
        if (isFavorite) {
          addToFavorites(item); // Pass full object
        } else {
            removeFromFavorites(item.id); // Only need id to remove
        }
       appState.favorites = getFavorites(); // reload full favorite objects
       renderCurrentCategory();
    }
        
        // // Update the UI
        // const favorites = getFavorites(); // Full objects
        // renderCards(cardsGrid, favorites, [], 'favorites');

// Show loading indicator
function showLoading() {
    appState.isLoading = true;
    loadingContainer.classList.add('show');
}

// Hide loading indicator
function hideLoading() {
    appState.isLoading = false;
    loadingContainer.classList.remove('show');
}

// Show empty state
function showEmptyState() {
    cardsGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
}

// Hide empty state
function hideEmptyState() {
    emptyState.classList.add('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);