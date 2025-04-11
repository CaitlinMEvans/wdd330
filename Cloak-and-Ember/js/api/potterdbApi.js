// https://api.potterdb.com/

// API Base URL
const API_BASE_URL = 'https://api.potterdb.com/v1';

// Helper function to determine spell light color based on effect or name
function getSpellLight(effect, name) {
    if (!effect && !name) return null;
    
    const text = (effect + ' ' + name).toLowerCase();
    
    // Check for specific keywords first
    if (text.includes('fire') || text.includes('incendio') || text.includes('burn')) {
        return 'Red';
    } else if (text.includes('stun') || text.includes('stupef')) {
        return 'Red';
    } else if (text.includes('shield') || text.includes('protect')) {
        return 'Blue';
    } else if (text.includes('heal') || text.includes('repair') || text.includes('bandage')) {
        return 'Green';
    } else if (text.includes('levitate') || text.includes('wingardium')) {
        return 'White';
    } else if (text.includes('summon') || text.includes('accio')) {
        return 'Purple';
    } else if (text.includes('unlock') || text.includes('alohomora')) {
        return 'Yellow';
    } else if (text.includes('lock') || text.includes('colloportus')) {
        return 'Orange';
    } else {
        // Deterministic color based on name
        // Use a hash-like function to always get the same color for the same name
        const nameHash = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const colors = ['Red', 'Green', 'Blue', 'White', 'Purple', 'Yellow', 'Orange'];
        return colors[nameHash % colors.length];
    }
}

// Fetch all spells from the API
export async function fetchSpells() {
    try {
        // Fetch the first page of spells
        const response = await fetch(`${API_BASE_URL}/spells`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch spells: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data - use the API format transforms to simpler format
        return data.data.map(spell => ({
            id: spell.id,
            name: spell.attributes.name,
            incantation: spell.attributes.incantation,
            effect: spell.attributes.effect,
            light: spell.attributes.light || getSpellLight(spell.attributes.effect, spell.attributes.name),
            type: getSpellType(spell.attributes.effect, spell.attributes.name),
            canBeVerbal: spell.attributes.incantation !== null && spell.attributes.incantation !== '',
            image: spell.attributes.image || getDefaultSpellImage(spell.attributes.light || getSpellLight(spell.attributes.effect, spell.attributes.name)),
            category: spell.attributes.category || null,
            type: 'spell'
        }));
    } catch (error) {
        console.error('Error fetching spells:', error);
        throw error;
    }
}

// Fetch a specific spell by ID
export async function fetchSpellById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/spells/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch spell by ID ${id}: ${response.status}`);
        }
        
        const data = await response.json();
        const spell = data.data;
        
        // Process the data
        return {
            id: spell.id,
            name: spell.attributes.name,
            incantation: spell.attributes.incantation,
            effect: spell.attributes.effect,
            light: getSpellLight(spell.attributes.effect, spell.attributes.name),
            type: getSpellType(spell.attributes.effect, spell.attributes.name),
            canBeVerbal: spell.attributes.incantation !== null && spell.attributes.incantation !== '',
            image: spell.attributes.image || getDefaultSpellImage(getSpellLight(spell.attributes.effect, spell.attributes.name)),
            type: 'spell'
        };
    } catch (error) {
        console.error(`Error fetching spell by ID ${id}:`, error);
        throw error;
    }
}

// Fetch all potions from the API
export async function fetchPotions() {
    try {
        const response = await fetch(`${API_BASE_URL}/potions`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch potions: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data
        return data.data.map(potion => ({
            id: potion.id,
            name: potion.attributes.name,
            effect: potion.attributes.effect,
            characteristics: potion.attributes.characteristics || '',
            color: getPotionColor(potion.attributes.characteristics),
            difficulty: getPotionDifficulty(potion.attributes.characteristics),
            ingredients: extractPotionIngredients(potion.attributes.ingredients),
            sideEffects: potion.attributes.side_effects || null,
            time: potion.attributes.time,
            image: potion.attributes.image || getDefaultPotionImage(potion.attributes.characteristics),
            type: 'potion'
        }));
    } catch (error) {
        console.error('Error fetching potions:', error);
        throw error;
    }
}

// Fetch a specific potion by ID
export async function fetchPotionById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/potions/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch potion by ID ${id}: ${response.status}`);
        }
        
        const data = await response.json();
        const potion = data.data;
        
        // Process the data
        return {
            id: potion.id,
            name: potion.attributes.name,
            effect: potion.attributes.effect,
            characteristics: getPotionCharacteristics(potion.attributes),
            difficulty: getPotionDifficulty(potion.attributes.characteristics),
            ingredients: extractPotionIngredients(potion.attributes.ingredients),
            sideEffects: potion.attributes.side_effects || null,
            time: potion.attributes.time,
            image: potion.attributes.image || getDefaultPotionImage(getPotionCharacteristics(potion.attributes)),
            type: 'potion'
        };
    } catch (error) {
        console.error(`Error fetching potion by ID ${id}:`, error);
        throw error;
    }
}

// Helper function to determine spell type
function getSpellType(effect, name) {
    if (!effect && !name) return 'Unknown';
    
    const text = (effect + ' ' + name).toLowerCase();
    
    if (text.includes('charm') || text.includes('levitate') || text.includes('summon')) {
        return 'Charm';
    } else if (text.includes('curse') || text.includes('crucio') || text.includes('imperio')) {
        return 'Curse';
    } else if (text.includes('jinx') || text.includes('bat-bogey')) {
        return 'Jinx';
    } else if (text.includes('transfigure') || text.includes('transform')) {
        return 'Transfiguration';
    } else if (text.includes('heal') || text.includes('mend') || text.includes('repair')) {
        return 'Healing';
    } else if (text.includes('shield') || text.includes('protect') || text.includes('defend')) {
        return 'Defensive';
    } else if (text.includes('attack') || text.includes('stun') || text.includes('stupe')) {
        return 'Offensive';
    } else {
        return 'Spell';
    }
}

// Extract potion characteristics from attributes
function getPotionCharacteristics(attributes) {
    let characteristics = [];
    
    if (attributes.characteristics) {
        characteristics.push(attributes.characteristics);
    }
    
    if (attributes.difficulty) {
        characteristics.push(`Difficulty: ${attributes.difficulty}`);
    }
    
    if (attributes.physical_description) {
        characteristics.push(attributes.physical_description);
    }
    
    return characteristics.join('. ');
}

// Extract potion difficulty from characteristics
function getPotionDifficulty(characteristics) {
    if (!characteristics) return 'Unknown';
    
    const text = characteristics.toLowerCase();
    
    if (text.includes('advanced') || text.includes('difficult') || text.includes('complex')) {
        return 'Advanced';
    } else if (text.includes('moderate') || text.includes('intermediate')) {
        return 'Intermediate';
    } else if (text.includes('simple') || text.includes('easy') || text.includes('basic')) {
        return 'Beginner';
    } else {
        return 'Intermediate';
    }
}

// Extract ingredients from text
function extractPotionIngredients(ingredientsText) {
    if (!ingredientsText) return [];
    
    // Split by commas or 'and'
    const parts = ingredientsText.split(/,|\sand\s/);
    
    // Filter out empty parts and create ingredient objects
    return parts
        .map(part => part.trim())
        .filter(part => part !== '')
        .map((name, index) => ({
            id: `ingredient-${index}`,
            name
        }));
}

// Get a default image for a spell based on its light color
function getDefaultSpellImage(light) {
    // Create a placeholder image URL based on the spell's light color
    const colorMap = {
        'Red': 'ff5555',
        'Green': '55ff55',
        'Blue': '5555ff',
        'White': 'ffffff',
        'Purple': 'aa55ff',
        'Yellow': 'ffff55',
        'Orange': 'ffaa55'
    };
    
    const color = light && colorMap[light] ? colorMap[light] : '5555ff';
    return `./assets/images/openbook.svg`;
}

// Get a default image for a potion based on its characteristics
function getDefaultPotionImage(characteristics) {
    // Extract color from characteristics if available
    let color = 'blue';
    
    if (characteristics) {
        const colorPattern = /(red|green|blue|purple|yellow|orange|black|white|pink|gold|silver|brown)/i;
        const match = characteristics.match(colorPattern);
        
        if (match && match[1]) {
            color = match[1].toLowerCase();
        }
    }
    
    return `./assets/images/openbook.svg`;
}

// Get CSS class for spell light
export function getSpellLightClass(light) {
    if (!light) return 'light-blue';
    
    const lightLower = light.toLowerCase();
    switch (lightLower) {
        case 'red':
            return 'light-red';
        case 'green':
            return 'light-green';
        case 'blue':
            return 'light-blue';
        case 'white':
            return 'light-white';
        case 'purple':
            return 'light-purple';
        case 'yellow':
            return 'light-yellow';
        case 'orange':
            return 'light-orange';
        default:
            return 'light-blue';
    }
}

// Extract potion color from characteristics
function getPotionColor(characteristics) {
    if (!characteristics) return null;
    
    // Define color keywords to look for
    const colorKeywords = {
        'blue': 'blue',
        'red': 'red',
        'green': 'green',
        'yellow': 'yellow',
        'purple': 'purple',
        'pink': 'pink',
        'orange': 'orange',
        'black': 'black',
        'white': 'white',
        'silver': 'silver',
        'gold': 'gold',
        'brown': 'brown',
        'grey': 'grey',
        'gray': 'grey',
        'turquoise': 'teal',
        'teal': 'teal'
    };
    
    // Convert characteristics to lowercase for case-insensitive matching
    const text = characteristics.toLowerCase();
    
    // Check for each color keyword
    for (const [keyword, color] of Object.entries(colorKeywords)) {
        if (text.includes(keyword)) {
            return color;
        }
    }
    
    // No color found in characteristics
    return null;
}

// Fetch characters in addition  to characters fetched from hpAPI
export async function fetchPotterDBCharacters() {
    try {
        const response = await fetch(`${API_BASE_URL}/characters`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch characters: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the data to match HP API structure
        return data.data.map(character => ({
            id: character.id,
            name: character.attributes.name,
            species: character.attributes.species,
            gender: character.attributes.gender,
            house: character.attributes.house,
            dateOfBirth: character.attributes.born,
            yearOfBirth: character.attributes.born ? 
                new Date(character.attributes.born).getFullYear() : null,
            wizard: character.attributes.species?.toLowerCase() === 'wizard',
            ancestry: character.attributes.blood_status,
            eyeColour: character.attributes.eye_colour,
            hairColour: character.attributes.hair_colour,
            wand: {
                wood: character.attributes.wand?.wood || null,
                core: character.attributes.wand?.core || null,
                length: character.attributes.wand?.length || null
            },
            patronus: character.attributes.patronus,
            hogwartsStudent: character.attributes.school === 'Hogwarts School of Witchcraft and Wizardry',
            hogwartsStaff: character.attributes.occupation?.includes('Professor'),
            actor: character.attributes.actor,
            alternate_names: character.attributes.alternate_names || [],
            image: character.attributes.image || null,
            type: 'character',
            subtype: character.attributes.school === 'Hogwarts School of Witchcraft and Wizardry' ? 
                (character.attributes.occupation?.includes('Professor') ? 'staff' : 'student') : 'other'
        }));
    } catch (error) {
        console.error('Error fetching Potter DB characters:', error);
        return []; // Return empty array instead of throwing error
    }
}

// Adding the books and movies data from the potterDB 
// Books
const booksApi = 'https://api.potterdb.com/v1/books';
async function fetchBooks() {
    try {
      const response = await fetch(booksApi);
      const data = await response.json();
      return data.data; 
    } catch (error) {
      console.error('Failed to fetch books:', error);
      return [];
    }
  }

const moviesApi = 'https://api.potterdb.com/v1/movies';
async function fetchMovies() {
    try {
      const response = await fetch(moviesApi);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      return [];
    }
  }