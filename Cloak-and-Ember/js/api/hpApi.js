// https://hp-api.onrender.com/

// Import Potter DB characters fetch
import { fetchPotterDBCharacters } from './potterdbApi.js';

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

// Merge characters from different sources
export async function fetchCharacters() {
    try {
        // Fetch from HP API first
        const hpCharacters = await fetchHPCharacters();
        
        // Fetch from Potter DB
        const potterDBCharacters = await fetchPotterDBCharacters();
        
        // Merge characters strategy
        const mergedCharacters = [...hpCharacters];
        
        // Add Potter DB characters, avoiding duplicates
        potterDBCharacters.forEach(potterDBChar => {
            // Check if character already exists (case-insensitive name match)
            const existingCharIndex = mergedCharacters.findIndex(hpChar => 
                hpChar.name.toLowerCase() === potterDBChar.name.toLowerCase()
            );
            
            // If character doesn't exist, add it
            if (existingCharIndex === -1) {
                mergedCharacters.push(potterDBChar);
            } else {
                // Merge additional information from Potter DB
                const mergedChar = mergedCharacters[existingCharIndex];
                
                // Merge specific fields, prioritizing existing data
                const fieldsToMerge = [
                    'species', 'gender', 'dateOfBirth', 'yearOfBirth', 
                    'ancestry', 'eyeColour', 'hairColour', 'patronus', 
                    'actor', 'alternate_names', 'wizard'
                ];
                
                fieldsToMerge.forEach(field => {
                    if (!mergedChar[field] && potterDBChar[field]) {
                        mergedChar[field] = potterDBChar[field];
                    }
                });
                
                // Merge wand details
                if (potterDBChar.wand) {
                    mergedChar.wand = mergedChar.wand || {};
                    ['wood', 'core', 'length'].forEach(wandField => {
                        if (!mergedChar.wand[wandField] && potterDBChar.wand[wandField]) {
                            mergedChar.wand[wandField] = potterDBChar.wand[wandField];
                        }
                    });
                }
                
                // Merge student/staff status
                if (!mergedChar.hogwartsStudent) {
                    mergedChar.hogwartsStudent = potterDBChar.hogwartsStudent;
                }
                if (!mergedChar.hogwartsStaff) {
                    mergedChar.hogwartsStaff = potterDBChar.hogwartsStaff;
                }
                
                // Update subtype based on merged data
                mergedChar.subtype = mergedChar.hogwartsStudent ? 'student' : 
                    (mergedChar.hogwartsStaff ? 'staff' : 'other');
            }
        });
        
        // Final processing
        return mergedCharacters.map(character => {
            // Find corresponding Potter DB character
            const potterDBChar = potterDBCharacters.find(p => 
                p.name.toLowerCase() === character.name.toLowerCase()
            );

            return {
                // image: (() => {
                //     console.log('Character name:', character.name);
                //     console.log('HP API image:', character.image);
                //     console.log('Potter DB character:', potterDBChar);
                //     console.log('Potter DB image:', potterDBChar?.image);
                    
                //     return character.image || 
                //            (potterDBChar?.image) || 
                //            (character.house ? getDefaultCharacterImage(character.house) : './assets/images/openbook.svg');
                // })(),
                ...character,
                // Image priority:
                // 1. HP API image (if exists)
                // 2. Potter DB image (if HP API image doesn't exist)
                // 3. House image (if no image from APIs)
                // 4. Default open book SVG (if no house or other image)
                image: character.image || 
                       (potterDBChar?.image) || 
                       (character.house ? getDefaultCharacterImage(character.house) : './assets/images/openbook.svg'),
                type: 'character',
                subtype: character.hogwartsStudent ? 'student' : 
                         (character.hogwartsStaff ? 'staff' : 'other')
            };
        });
    } catch (error) {
        console.error('Error fetching and merging characters:', error);
        throw error;
    }
}

// Fetch HP API characters
async function fetchHPCharacters() {
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
            // Prefer existing image strategy
            image: character.image || getDefaultCharacterImage(character.house)
        }));
    } catch (error) {
        console.error('Error fetching HP characters:', error);
        throw error;
    }
}

// Fetch Hogwarts students from the API
export async function fetchStudents() {
    const allCharacters = await fetchCharacters();
    return allCharacters.filter(character => character.hogwartsStudent);
}

// Fetch Hogwarts staff from the API
export async function fetchStaff() {
    const allCharacters = await fetchCharacters();
    return allCharacters.filter(character => character.hogwartsStaff);
}

// Fetch characters by house
export async function fetchCharactersByHouse(house) {
    const allCharacters = await fetchCharacters();
    return allCharacters.filter(character => 
        character.house && character.house.toLowerCase() === house.toLowerCase()
    );
}

// Fetch a specific character by ID
export async function fetchCharacterById(id) {
    const allCharacters = await fetchCharacters();
    return allCharacters.find(character => character.id === id);
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