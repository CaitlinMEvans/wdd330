
// API Base URL
const API_BASE_URL = 'https://wizard-world-api.herokuapp.com';

// Fetch all spells from the API
export async function fetchWWSpells() {
  try {
    const response = await fetch(`${API_BASE_URL}/Spells`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch spells: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the data to match our application's format
    return data.map(spell => ({
      id: spell.id,
      name: spell.name,
      incantation: spell.incantation,
      effect: spell.effect,
      canBeVerbal: spell.canBeVerbal,
      type: 'spell',
      light: getSpellLight(spell.effect, spell.name),
      image: './assets/images/openbook.svg' // Default image
    }));
  } catch (error) {
    console.error('Error fetching spells from Wizard World API:', error);
    throw error;
  }
}

// Fetch all elixirs (potions) from the API
export async function fetchWWElixirs() {
  try {
    const response = await fetch(`${API_BASE_URL}/Elixirs`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch elixirs: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the data to match our application's format
    return data.map(elixir => ({
      id: elixir.id,
      name: elixir.name,
      effect: elixir.effect,
      characteristics: elixir.characteristics || '',
      difficulty: determineDifficulty(elixir),
      ingredients: elixir.ingredients.map((ingredient, index) => ({
        id: `ingredient-${index}`,
        name: ingredient.name
      })),
      type: 'potion',
      sideEffects: elixir.sideEffects,
      image: './assets/images/openbook.svg' // Default image
    }));
  } catch (error) {
    console.error('Error fetching elixirs from Wizard World API:', error);
    throw error;
  }
}

// Fetch all wizards from the API
export async function fetchWWWizards() {
  try {
    const response = await fetch(`${API_BASE_URL}/Wizards`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch wizards: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the data to match our application's format
    return data.map(wizard => ({
      id: wizard.id,
      name: `${wizard.firstName} ${wizard.lastName}`,
      type: 'character',
      subtype: 'wizard',
      image: './assets/images/openbook.svg' // Default image
    }));
  } catch (error) {
    console.error('Error fetching wizards from Wizard World API:', error);
    throw error;
  }
}

// Helper function to determine spell light color based on effect or name
function getSpellLight(effect, name) {
  if (!effect && !name) return null;
  
  const text = (effect + ' ' + name).toLowerCase();
  
  // Similar logic to your existing getSpellLight function
  if (text.includes('fire') || text.includes('incendio') || text.includes('burn')) {
    return 'Red';
  } else if (text.includes('stun') || text.includes('stupef')) {
    return 'Red';
  }
  // Add more cases...
  
  // Random assignment for spells without clear indication
  const colors = ['Red', 'Green', 'Blue', 'White', 'Purple', 'Yellow', 'Orange'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function to determine potion difficulty
function determineDifficulty(elixir) {
  // You could determine this based on number of ingredients, brewing time, etc.
  if (!elixir.ingredients) return 'Unknown';
  
  const ingredientCount = elixir.ingredients.length;
  
  if (ingredientCount > 7) {
    return 'Advanced';
  } else if (ingredientCount > 4) {
    return 'Intermediate';
  } else {
    return 'Beginner';
  }
}

// Fetch a specific spell by ID
export async function fetchWWSpellById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Spells/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch spell: ${response.status}`);
        }
        
        const spell = await response.json();
        
        return {
            id: spell.id,
            name: spell.name,
            incantation: spell.incantation,
            effect: spell.effect,
            canBeVerbal: spell.canBeVerbal,
            type: 'spell',
            light: getSpellLight(spell.effect, spell.name),
            image: './assets/images/openbook.svg'
        };
    } catch (error) {
        console.error(`Error fetching spell by ID ${id}:`, error);
        throw error;
    }
}

// Fetch a specific elixir by ID
export async function fetchWWElixirById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Elixirs/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch elixir: ${response.status}`);
        }
        
        const elixir = await response.json();
        
        return {
            id: elixir.id,
            name: elixir.name,
            effect: elixir.effect,
            characteristics: elixir.characteristics || '',
            difficulty: determineDifficulty(elixir),
            ingredients: elixir.ingredients.map((ingredient, index) => ({
                id: `ingredient-${index}`,
                name: ingredient.name
            })),
            type: 'potion',
            sideEffects: elixir.sideEffects,
            image: './assets/images/openbook.svg'
        };
    } catch (error) {
        console.error(`Error fetching elixir by ID ${id}:`, error);
        throw error;
    }
}