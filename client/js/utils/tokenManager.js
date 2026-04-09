/**
 * @file tokenManager.js
 * @description Handles storing, retrieving, and clearing the JWT token
 * in the browser's sessionStorage.
*/

const TOKEN_KEY = 'jwt_token'

/**
 * Saves the JWT token to the sessionStorage.
 *
 * @param {string} token - The JWT token to store.
 * @returns {void}
 */
const saveToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token)
}

/**
 * Retrieves the JWT token from the sessionStorage.
 *
 * @returns {string|null} - The JWT token, or null if not found.
 */
const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY)
}

/**
 * Removes the JWT token from the sessionStorage.
 *
 * @returns {void}
 */
const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY)
}

/**
 * Checks whether a valid JWT token exists in the sessionStorage.
 *
 * @returns {boolean} - True if a token exists, otherwise false.
 */
const isAuthenticated = () => {
  return getToken() !== null
}