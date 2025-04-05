// https://hp-api.onrender.com/

// API Base URL
const API_BASE_URL = 'https://hp-api.onrender.com/api';

// Helper function for default character images
function getDefaultCharacterImage(house) {
    // Default image based on house
    if (house === 'Gryffindor') {
        return './assets/images/houses/gryffindor.webp';
    } else if (house === 'Slytherin') {
        return './assets/images/houses/slytherin.webp';
    } else if (house === 'Ravenclaw') {
        return './assets/images/houses/ravenclaw.webp';
    } else if (house === 'Hufflepuff') {
        return './assets/images/houses/hufflepuff.webp';
    } else {
        return './assets/images/openbook.svg';
    }
}

// Fetch all characters from the API
export async function fetchCharacters() {
    try {
        const response = await fetch(`${API_BASE_URL}/characters`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch characters: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data to add needed properties
        return data.map(character => ({
            ...character,
            type: 'character',
            subtype: character.hogwartsStudent ? 'student' : 
                     character.hogwartsStaff ? 'staff' : 'other',
            // Add a better image fallback strategy
            image: character.image || getDefaultCharacterImage(character.house)
        }));
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
}

// Fetch Hogwarts students from the API
export async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/characters/students`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data
        return data.map(student => ({
            ...student,
            type: 'character',
            subtype: 'student',
            image: student.image || getDefaultCharacterImage(student.house)
        }));
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

// Fetch Hogwarts staff from the API
export async function fetchStaff() {
    try {
        const response = await fetch(`${API_BASE_URL}/characters/staff`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch staff: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data
        return data.map(staff => ({
            ...staff,
            type: 'character',
            subtype: 'staff',
            image: staff.image || getDefaultCharacterImage(staff.house)
        }));
    } catch (error) {
        console.error('Error fetching staff:', error);
        throw error;
    }
}

// Fetch characters by house
export async function fetchCharactersByHouse(house) {
    try {
        const response = await fetch(`${API_BASE_URL}/characters/house/${house}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch characters for house ${house}: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data
        return data.map(character => ({
            ...character,
            type: 'character',
            subtype: character.hogwartsStudent ? 'student' : 
                     character.hogwartsStaff ? 'staff' : 'other',
            image: character.image || getDefaultCharacterImage(character.house)
        }));
    } catch (error) {
        console.error(`Error fetching characters for house ${house}:`, error);
        throw error;
    }
}

// Fetch a specific character by ID
export async function fetchCharacterById(id) {
    try {
        // We don't have a direct endpoint for fetching by ID,
        // so we'll fetch all characters and find the one we want
        const allCharacters = await fetchCharacters();
        return allCharacters.find(character => character.id === id);
    } catch (error) {
        console.error(`Error fetching character by ID ${id}:`, error);
        throw error;
    }
}

// Get wand details
export function getWandDetails(character) {
    if (!character.wand || !character.wand.wood) {
        return 'Unknown';
    }
    
    const { wood, core, length } = character.wand;
    let details = '';
    
    if (wood) details += `${wood}`;
    if (core) details += details ? `, ${core}` : core;
    if (length) details += details ? `, ${length} inches` : `${length} inches`;
    
    return details || 'Unknown';
}

// Determine if a character is a favorite
export function isCharacterFavorite(character, favorites) {
    return favorites.includes(character.id);
}

// Get house color class
export function getHouseColorClass(house) {
    const houseLower = house ? house.toLowerCase() : '';
    
    switch (houseLower) {
        case 'gryffindor':
            return 'house-gryffindor';
        case 'slytherin':
            return 'house-slytherin';
        case 'ravenclaw':
            return 'house-ravenclaw';
        case 'hufflepuff':
            return 'house-hufflepuff';
        default:
            return '';
    }
}