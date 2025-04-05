// Miscellaneous helper functions

// Filter and sort items based on sort option
export function filterAndSortItems(items, sortOption) {
    // Clone the array to avoid modifying the original
    const sortedItems = [...items];
    
    // Sort based on option
    switch (sortOption) {
        case 'name-asc':
            return sortedItems.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        case 'name-desc':
            return sortedItems.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        case 'house':
            return sortedItems.sort((a, b) => {
                // For characters with houses
                if (a.house && b.house) {
                    return a.house.localeCompare(b.house);
                }
                // Characters with houses first
                if (a.house && !b.house) return -1;
                if (!a.house && b.house) return 1;
                // Default to name sorting if no houses
                return (a.name || '').localeCompare(b.name || '');
            });
        case 'type':
            return sortedItems.sort((a, b) => {
                // Sort by type first
                if (a.type !== b.type) {
                    return a.type.localeCompare(b.type);
                }
                // Then by subtype if available
                if (a.subtype && b.subtype && a.subtype !== b.subtype) {
                    return a.subtype.localeCompare(b.subtype);
                }
                // Default to name sorting
                return (a.name || '').localeCompare(b.name || '');
            });
        default:
            return sortedItems;
    }
}

// Get item type label
export function getItemTypeLabel(type, subtype) {
    switch (type) {
        case 'character':
            if (subtype === 'student') return 'Student';
            if (subtype === 'staff') return 'Staff';
            return 'Character';
        case 'spell':
            return 'Spell';
        case 'potion':
            return 'Potion';
        case 'quote':
            return 'Quote';
        default:
            return 'Item';
    }
}

// Format date string
export function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        // Parse date in format DD-MM-YYYY
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
        const year = parseInt(parts[2], 10);
        
        const date = new Date(year, month, day);
        
        // Format date for display
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error parsing date:', error);
        return dateString;
    }
}

// Truncate text to a certain length with ellipsis
export function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
}

// Generate a random color
export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    
    return color;
}

// Check if a value is defined and not empty
export function isDefined(value) {
    return value !== null && value !== undefined && value !== '';
}

// Convert a string to title case (capitalize first letter of each word)
export function toTitleCase(str) {
    if (!str) return '';
    
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Generate a unique ID
export function generateUniqueId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
}

// Debounce function to limit how often a function is called
export function debounce(func, delay) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
    };
}

// Format number with commas
export function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}