/**
 * @file helpers.js
 * @description The general utility functions that is reused across the application.
 */

/**
 * Extracts a query parameter value from the current URL.
 *
 * @param {string} parameterName - The name of the query parameter to extract.
 * @returns {string|null} - The value of the parameter, or null if not found.
 */
const getQueryParameter = (parameterName) => {
  const urlParameters = new URLSearchParams(window.location.search)
  return urlParameters.get(parameterName)
}

/**
 * Formats a number as a string with thousand separators.
 *
 * @param {number} number - The number to format.
 * @returns {string} - The formatted number string.
 */
const formatNumber = (number) => {
  return number.toLocaleString('en-US')
}

/**
 * Shortens a string to a maximum length and adds '...' at the end if it was cut.
 *
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum allowed length.
 * @returns {string} - The truncated string.
 */
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength)}...`
}

/**
 * Shows an element by removing the 'hidden' CSS class.
 *
 * @param {HTMLElement} element - The DOM element to show.
 */
const showElement = (element) => {
  element.classList.remove('hidden')
}

/**
 * Hides an element by adding the 'hidden' CSS class.
 *
 * @param {HTMLElement} element - The DOM element to hide.
 */
const hideElement = (element) => {
  element.classList.add('hidden')
}