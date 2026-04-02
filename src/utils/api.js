/**
 * API Configuration and Helper Functions
 * Centralizes all API calls to use environment variables
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://billingsystem-backend-xjdb.onrender.com';

/**
 * Make a fetch request to the API
 * @param {string} endpoint - The API endpoint (e.g., '/admin?type=fish')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>}
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
};

/**
 * Make a GET request to the API
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<Response>}
 */
export const apiGet = (endpoint) => {
  return apiCall(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - The API endpoint
 * @param {object} data - Data to send in request body
 * @returns {Promise<Response>}
 */
export const apiPost = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

/**
 * Make a PATCH request to the API
 * @param {string} endpoint - The API endpoint
 * @param {object} data - Data to send in request body
 * @returns {Promise<Response>}
 */
export const apiPatch = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

/**
 * Make a DELETE request to the API
 * @param {string} endpoint - The API endpoint
 * @param {object} data - Optional data to send in request body
 * @returns {Promise<Response>}
 */
export const apiDelete = (endpoint, data = null) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return apiCall(endpoint, options);
};

export default API_BASE_URL;
