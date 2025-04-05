// https://rapidapi.com/hannanel100/api/harry-potter-quotes

import { fetchCharacters } from './hpApi.js';

// API configuration
const API_URL = 'https://harry-potter-quotes.p.rapidapi.com/api/v1/quotes';
const API_HOST = 'harry-potter-quotes.p.rapidapi.com';

// You would need to replace this with your actual RapidAPI key
// For security, this should be stored in an environment variable in a production app
const API_KEY = 'YOUR_RAPIDAPI_KEY';

// Cache for character data to avoid repetitive fetching
let characterCache = null;

// Fetch all quotes from the API or fallback to local JSON
export async function fetchQuotes() {
    try {
        // Load character data for image matching if not already cached
        if (!characterCache) {
            try {
                characterCache = await fetchCharacters();
            } catch (error) {
                console.warn('Could not load character data for image matching:', error);
                characterCache = [];
            }
        }

        // First, try to fetch from RapidAPI
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': API_KEY,
                    'X-RapidAPI-Host': API_HOST
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch quotes from RapidAPI: ${response.status}`);
            }
            
            const apiData = await response.json();
            
            // Process the API data
            return apiData.map((quote, index) => ({
                id: `quote-${index}`,
                text: quote.quote,
                character: quote.character,
                type: 'quote',
                image: getCharacterImage(quote.character)
            }));
        } catch (apiError) {
            console.warn('RapidAPI fetch failed:', apiError);
            // Proceed to the local JSON file
            return fetchLocalQuotes();
        }
    } catch (error) {
        console.log('Using local quotes.json as fallback');
        return fetchLocalQuotes();
    }
}

// Fetch quotes from the local JSON file
async function fetchLocalQuotes() {
    try {
        // Use the path that worked successfully
        console.log('Trying to fetch quotes from: ./data/quotes.json');
        const response = await fetch('./data/quotes.json');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch local quotes: ${response.status}`);
        }
        
        console.log('Successfully loaded quotes from: ./data/quotes.json');
        const quotes = await response.json();
        
        // Process the quotes to match your application format
        return quotes.map(quote => ({
            id: quote.id,
            text: quote.quote,
            character: quote.speaker,
            story: quote.story,
            source: quote.source,
            type: 'quote',
            image: getCharacterImage(quote.speaker)
        }));
    } catch (error) {
        console.error('Failed to load local quotes:', error);
        
        // If all else fails, return a single fallback quote
        return [{
            id: 'quote-fallback',
            text: "Sometimes we find ourselves in dark places, but remember, light can always be found if we are brave enough to see it.",
            character: "Albus Dumbledore",
            story: "Fictional Wisdom",
            source: "Fallback Quote",
            type: 'quote',
            image: getCharacterImage("Albus Dumbledore")
        }];
    }
}

// Enhanced character image finder that uses multiple strategies
function getCharacterImage(characterName) {
    // Strategy 1: Try to find the character in our character cache from the HP API
    if (characterCache && characterCache.length > 0) {
        // Try exact match
        let character = characterCache.find(char => 
            char.name.toLowerCase() === characterName.toLowerCase());
        
        // If no exact match, try to find character where name contains the quote character's name
        if (!character) {
            character = characterCache.find(char => 
                characterName.toLowerCase().includes(char.name.toLowerCase()) || 
                char.name.toLowerCase().includes(characterName.toLowerCase()));
        }
        
        // If found, use their image
        if (character && character.image) {
            return character.image;
        }
        
        // If character found but no image, use house image
        if (character && character.house) {
            return `./assets/images/houses/${character.house.toLowerCase()}.webp`;
        }
    }
    
    // Check Wizard World wizards if available
    if (window.wizardWorldWizardsCache && window.wizardWorldWizardsCache.length > 0) {
        const wizard = window.wizardWorldWizardsCache.find(w => 
            w.name.toLowerCase().includes(characterName.toLowerCase()) ||
            characterName.toLowerCase().includes(w.name.toLowerCase()));
        
        if (wizard && wizard.image) {
            return wizard.image;
        }
    } 
    
    // Default fallback
    return './assets/images/openbook.svg';
}



// import { fetchCharacters } from './hpApi.js';

// // API configuration
// const API_URL = 'https://harry-potter-quotes.p.rapidapi.com/api/v1/quotes';
// const API_HOST = 'harry-potter-quotes.p.rapidapi.com';

// // You would need to replace this with your actual RapidAPI key
// // For security, this should be stored in an environment variable in a production app
// const API_KEY = 'YOUR_RAPIDAPI_KEY';

// // Cache for character data to avoid repetitive fetching
// let characterCache = null;

// // Fetch all quotes from the API or fallback to local JSON
// export async function fetchQuotes() {
//     try {
//         // Load character data for image matching if not already cached
//         if (!characterCache) {
//             try {
//                 characterCache = await fetchCharacters();
//             } catch (error) {
//                 console.warn('Could not load character data for image matching:', error);
//                 characterCache = [];
//             }
//         }

//         // First, try to fetch from RapidAPI
//         try {
//             const response = await fetch(API_URL, {
//                 method: 'GET',
//                 headers: {
//                     'X-RapidAPI-Key': API_KEY,
//                     'X-RapidAPI-Host': API_HOST
//                 }
//             });
            
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch quotes from RapidAPI: ${response.status}`);
//             }
            
//             const apiData = await response.json();
            
//             // Process the API data
//             return apiData.map((quote, index) => ({
//                 id: `quote-${index}`,
//                 text: quote.quote,
//                 character: quote.character,
//                 type: 'quote',
//                 image: getCharacterImage(quote.character)
//             }));
//         } catch (apiError) {
//             console.warn('RapidAPI fetch failed:', apiError);
//             // Proceed to the local JSON file
//             throw apiError; // throw to continue to the next catch block
//         }
//     } catch (error) {
//         console.log('Using local quotes.json as fallback');
//         return fetchLocalQuotes();
//     }
// }

// // Fetch quotes from the local JSON file
// async function fetchLocalQuotes() {
//     try {
//         // Use the correct relative path
//         console.log('Trying to fetch quotes from: ./data/quotes.json');
//         const response = await fetch('./data/quotes.json');
        
//         if (!response.ok) {
//             throw new Error(`Failed to fetch local quotes: ${response.status}`);
//         }
        
//         console.log('Successfully loaded quotes from: ./data/quotes.json');
//         const quotes = await response.json();
        
//         // Process the quotes to match your application format
//         return quotes.map(quote => ({
//             id: quote.id,
//             text: quote.quote,
//             character: quote.speaker,
//             story: quote.story,
//             source: quote.source,
//             type: 'quote',
//             image: getCharacterImage(quote.speaker)
//         }));
//     } catch (localError) {
//         console.error('Failed to load local quotes:', localError);
//     }
// }

// // Enhanced character image finder that uses multiple strategies
// function getCharacterImage(characterName) {
//     // Strategy 1: Try to find the character in our character cache from the HP API
//     if (characterCache && characterCache.length > 0) {
//         // Try exact match
//         let character = characterCache.find(char => 
//             char.name && characterName && char.name.toLowerCase() === characterName.toLowerCase());
        
//         // If no exact match, try to find character where name contains the quote character's name
//         if (!character) {
//             character = characterCache.find(char => 
//                 char.name && characterName && (
//                     characterName.toLowerCase().includes(char.name.toLowerCase()) || 
//                     char.name.toLowerCase().includes(characterName.toLowerCase())
//                 )
//             );
//         }
        
//         // If found, use their image
//         if (character && character.image) {
//             return character.image;
//         }
        
//         // If character found but no image, use house image
//         if (character && character.house) {
//             return `./assets/images/houses/${character.house.toLowerCase()}.webp`;
//         }
//     }
    
//     // Check Wizard World wizards if available
//     if (window.wizardWorldWizardsCache && window.wizardWorldWizardsCache.length > 0) {
//         const wizard = window.wizardWorldWizardsCache.find(w => 
//             w.name && characterName && (
//                 w.name.toLowerCase().includes(characterName.toLowerCase()) ||
//                 characterName.toLowerCase().includes(w.name.toLowerCase())
//             )
//         );
        
//         if (wizard && wizard.image) {
//             return wizard.image;
//         }
//     } 
    
//     // Default fallback
//     return './assets/images/openbook.svg';
// }