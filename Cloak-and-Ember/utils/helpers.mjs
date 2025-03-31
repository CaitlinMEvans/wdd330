// Quotes API Module - Handles interactions with Harry Potter Quotes API
import { cacheData, getCachedData } from '../utils/helpers.mjs';

const BASE_URL = 'https://api.potterdb.com/v1/quotes';

// We're using this alternate API since the RapidAPI one requires an API key
// This is a free Potter quotes API that doesn't require authentication

// Cache keys
const CACHE_KEYS = {
    ALL_QUOTES: 'all-quotes',
    QUOTES_BY_CHARACTER: 'quotes-by-character',
};

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Fetch data from the Quotes API with error handling and caching
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {string} cacheKey - The key to use for caching
 * @returns {Promise<Array>} - The data from the API
 */
async function fetchFromQuotesApi(endpoint, cacheKey) {
    try {
        // Check if we have cached data
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            console.log(`Using cached data for ${cacheKey}`);
            return cachedData;
        }
        
        // If no cached data, fetch from API
        console.log(`Fetching from Quotes API: ${endpoint}`);
        const response = await fetch(`${BASE_URL}${endpoint}`);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Cache the data for future use
        const quotes = data.data || [];
        cacheData(cacheKey, quotes, CACHE_EXPIRATION);
        
        return quotes;
    } catch (error) {
        console.error(`Error fetching from Quotes API (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Get all quotes
 * @returns {Promise<Array>} - All quotes
 */
export async function getAllQuotes() {
    return fetchFromQuotesApi('', CACHE_KEYS.ALL_QUOTES);
}

/**
 * Get a random quote
 * @returns {Promise<Object>} - A random quote
 */
export async function getRandomQuote() {
    // Get all quotes
    const allQuotes = await getAllQuotes();
    
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    return allQuotes[randomIndex];
}

/**
 * Get multiple random quotes
 * @param {number} count - The number of random quotes to get
 * @returns {Promise<Array>} - Random quotes
 */
export async function getRandomQuotes(count = 1) {
    // Get all quotes
    const allQuotes = await getAllQuotes();
    
    // Shuffle the array to get random quotes
    const shuffled = [...allQuotes].sort(() => 0.5 - Math.random());
    
    // Return the requested number of quotes
    return shuffled.slice(0, count);
}

/**
 * Format a quote for display
 * @param {Object} quote - The quote object from the API
 * @returns {Object} - A formatted quote object
 */
export function formatQuote(quote) {
    return {
        id: quote.id,
        content: quote.attributes.content,
        character: quote.attributes.character || 'Unknown',
        source: quote.attributes.meta ? quote.attributes.meta.source : 'Unknown',
        type: 'quote'
    };
}

/**
 * Group quotes by character
 * @returns {Promise<Object>} - Quotes grouped by character
 */
export async function getQuotesByCharacter() {
    // Get all quotes
    const allQuotes = await getAllQuotes();
    
    // Group quotes by character
    const quotesByCharacter = {};
    
    allQuotes.forEach(quote => {
        const character = quote.attributes.character || 'Unknown';
        
        if (!quotesByCharacter[character]) {
            quotesByCharacter[character] = [];
        }
        
        quotesByCharacter[character].push(formatQuote(quote));
    });
    
    return quotesByCharacter;
}

/**
 * Get all quotes from a specific character
 * @param {string} character - The character name
 * @returns {Promise<Array>} - All quotes from the specified character
 */
export async function getQuotesFromCharacter(character) {
    // Get all quotes
    const allQuotes = await getAllQuotes();
    
    // Filter quotes by character (case-insensitive)
    const characterQuotes = allQuotes.filter(quote => {
        const quoteCharacter = quote.attributes.character || '';
        return quoteCharacter.toLowerCase() === character.toLowerCase();
    });
    
    return characterQuotes.map(formatQuote);
}