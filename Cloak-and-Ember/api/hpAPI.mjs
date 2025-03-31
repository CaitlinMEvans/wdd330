// HP API Module - Handles interactions with https://hp-api.onrender.com/
import { cacheData, getCachedData } from '../utils/helpers.mjs';

const BASE_URL = 'https://hp-api.onrender.com/api';

// Cache keys
const CACHE_KEYS = {
    ALL_CHARACTERS: 'all-characters',
    STUDENTS: 'hogwarts-students',
    STAFF: 'hogwarts-staff',
    HOUSE_MEMBERS: 'house-members',
};

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Fetch data from the HP API with error handling and caching
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {string} cacheKey - The key to use for caching
 * @returns {Promise<Array>} - The data from the API
 */
async function fetchFromHpApi(endpoint, cacheKey) {
    try {
        // Check if we have cached data
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            console.log(`Using cached data for ${cacheKey}`);
            return cachedData;
        }
        
        // If no cached data, fetch from API
        console.log(`Fetching from HP API: ${endpoint}`);
        const response = await fetch(`${BASE_URL}${endpoint}`);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Cache the data for future use
        cacheData(cacheKey, data, CACHE_EXPIRATION);
        
        return data;
    } catch (error) {
        console.error(`Error fetching from HP API (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Get all characters from the HP API
 * @returns {Promise<Array>} - All characters
 */
export async function getAllCharacters() {
    return fetchFromHpApi('/characters', CACHE_KEYS.ALL_CHARACTERS);
}

/**
 * Get a specific character by ID
 * @param {string} id - The character ID
 * @returns {Promise<Object>} - The character object
 */
export async function getCharacterById(id) {
    // First get all characters (possibly from cache)
    const allCharacters = await getAllCharacters();
    
    // Find the character with the specified ID
    const character = allCharacters.find(char => char.id === id);
    
    // If no character found, throw an error
    if (!character) {
        throw new Error(`Character with ID ${id} not found`);
    }
    
    return character;
}

/**
 * Get all Hogwarts students
 * @returns {Promise<Array>} - All Hogwarts students
 */
export async function getHogwartsStudents() {
    return fetchFromHpApi('/characters/students', CACHE_KEYS.STUDENTS);
}

/**
 * Get all Hogwarts staff members
 * @returns {Promise<Array>} - All Hogwarts staff members
 */
export async function getHogwartsStaff() {
    return fetchFromHpApi('/characters/staff', CACHE_KEYS.STAFF);
}

/**
 * Get all characters from a specific house
 * @param {string} house - The house name (Gryffindor, Slytherin, Ravenclaw, Hufflepuff)
 * @returns {Promise<Array>} - All characters from the specified house
 */
export async function getCharactersByHouse(house) {
    return fetchFromHpApi(`/characters/house/${house}`, `${CACHE_KEYS.HOUSE_MEMBERS}-${house.toLowerCase()}`);
}

/**
 * Get random characters from all characters
 * @param {number} count - The number of random characters to get
 * @returns {Promise<Array>} - Random characters
 */
export async function getRandomCharacters(count = 1) {
    // Get all characters
    const allCharacters = await getAllCharacters();
    
    // Filter out characters without images
    const charactersWithImages = allCharacters.filter(char => char.image && char.image.trim() !== '');
    
    // If no characters with images, use all characters
    const charactersToUse = charactersWithImages.length > 0 ? charactersWithImages : allCharacters;
    
    // Shuffle the array to get random characters
    const shuffled = [...charactersToUse].sort(() => 0.5 - Math.random());
    
    // Return the requested number of characters
    return shuffled.slice(0, count);
}

/**
 * Get characters grouped by house
 * @returns {Promise<Object>} - Characters grouped by house
 */
export async function getCharactersByHouseGrouped() {
    // Get all characters
    const allCharacters = await getAllCharacters();
    
    // Group characters by house
    const houses = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
    const charactersByHouse = {};
    
    houses.forEach(house => {
        charactersByHouse[house] = allCharacters.filter(char => 
            char.house && char.house.toLowerCase() === house.toLowerCase()
        );
    });
    
    // Add characters with no house
    charactersByHouse['Unknown'] = allCharacters.filter(char => !char.house);
    
    return charactersByHouse;
}

/**
 * Get statistics about characters (counts by house, student/staff, etc.)
 * @returns {Promise<Object>} - Character statistics
 */
export async function getCharacterStats() {
    // Get all characters
    const allCharacters = await getAllCharacters();
    
    // Calculate statistics
    const stats = {
        totalCount: allCharacters.length,
        byHouse: {
            Gryffindor: 0,
            Slytherin: 0,
            Ravenclaw: 0,
            Hufflepuff: 0,
            Unknown: 0
        },
        byRole: {
            students: 0,
            staff: 0,
            other: 0
        },
        byStatus: {
            alive: 0,
            deceased: 0
        }
    };
    
    // Count characters by category
    allCharacters.forEach(char => {
        // By house
        if (char.house) {
            stats.byHouse[char.house] = (stats.byHouse[char.house] || 0) + 1;
        } else {
            stats.byHouse.Unknown++;
        }
        
        // By role
        if (char.hogwartsStudent) {
            stats.byRole.students++;
        } else if (char.hogwartsStaff) {
            stats.byRole.staff++;
        } else {
            stats.byRole.other++;
        }
        
        // By status
        if (char.alive) {
            stats.byStatus.alive++;
        } else {
            stats.byStatus.deceased++;
        }
    });
    
    return stats;
}