/**
 * Extracts the ID from the URL path.
 * Assumes ID is the last segment (e.g., /www/tree/4 -> '4').
 * @returns {string | null} ID or null.
 */
export function getPathId() {
    // Splits path, removes empty strings.
    const segments = window.location.pathname.split('/').filter(Boolean);

    // ID is the last segment.
    if (segments.length > 0) {
        return segments[segments.length - 1];
    }
    return null; 
}

/**
 * Updates the browser URL without page reload.
 * @param {string} id - The new person ID.
 */
export function navigateTo(id) {
    // Hardcoded prefix based on file structure.
    const newPath = `/www/tree/${id}`;
    
    // Uses the History API.
    history.pushState(null, '', newPath);
}