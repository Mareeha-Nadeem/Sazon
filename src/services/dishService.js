import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
});

/**
 * @typedef {Object} DishFilters
 * @property {string} category - Dish category
 * @property {[number, number]} priceRange - Min and max price
 * @property {string[]} dietary - Dietary restrictions
 * @property {string} sortBy - Sort criteria
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} data - Array of items
 * @property {number} total - Total number of items
 * @property {number} page - Current page
 * @property {number} pageSize - Items per page
 * @property {boolean} hasNextPage - Whether there are more pages
 */

// Helper function to validate and parse recipe data
const parseRecipeData = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      console.error('Failed to parse recipe data:', data);
      return null;
    }
  }
  return data;
};

/**
 * Fetch featured dishes
 * @returns {Promise<Object>} Featured dish data
 */
export const fetchFeaturedDishes = async () => {
  try {
    const { data } = await api.get('/menu');
    // For now, return the first menu item as featured
    const featured = Array.isArray(data) && data.length > 0 ? data[0] : null;
    
    if (!featured) {
      throw new Error('No featured dishes available');
    }

    return {
      ...featured,
      rating: Math.random() * 2 + 3, // Random rating between 3-5
      spiceLevel: 'Medium',
      servings: '2-4 people',
      cookTime: '30-45 mins'
    };
  } catch (error) {
    console.error('Error fetching featured dishes:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch featured dishes. Please try again later.'
    );
  }
};

/**
 * Search dishes with filters and pagination
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query
 * @param {DishFilters} params.filters - Filters
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Items per page
 * @returns {Promise<PaginatedResponse>} Paginated dish data
 */
export const searchDishes = async ({ query, filters = {}, page = 1, pageSize = 12 }) => {
  try {
    const { data } = await api.get('/menu');
    
    // Filter and transform menu items
    const dishes = Array.isArray(data) ? data : [];
    const validDishes = dishes.map(dish => ({
      ...dish,
      id: dish.id || Math.random().toString(36).substr(2, 9),
      rating: Math.random() * 2 + 3, // Random rating between 3-5
      cookTime: '30-45 mins'
    }));

    return {
      data: validDishes,
      total: validDishes.length,
      page: 1,
      pageSize: validDishes.length,
      hasNextPage: false
    };
  } catch (error) {
    console.error('Error searching dishes:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to search dishes. Please try again later.'
    );
  }
};

/**
 * Get dish details by ID
 * @param {string} id - Dish ID
 * @returns {Promise<Object>} Dish details
 */
export const getDishById = async (id) => {
  try {
    const { data } = await api.get(`/menu/${id}`);
    return {
      ...data,
      rating: Math.random() * 2 + 3, // Random rating between 3-5
      spiceLevel: 'Medium',
      servings: '2-4 people',
      cookTime: '30-45 mins'
    };
  } catch (error) {
    console.error('Error fetching dish details:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch dish details. Please try again later.'
    );
  }
};

/**
 * Get dish categories
 * @returns {Promise<Array>} List of categories
 */
export const getCategories = async () => {
  try {
    const { data } = await api.get('/categories');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch categories. Please try again later.'
    );
  }
}; 