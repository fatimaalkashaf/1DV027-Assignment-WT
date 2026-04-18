/**
 * @file pagination.js
 * @description Handles the rendering and interaction of pagination controls.
 */

/**
 * Renders pagination buttons based on the total pages and the current page.
 * Calls the provided callback function when a page button is begin clicked.
 *
 * @param {string} containerId - The ID of the container element for pagination.
 * @param {number} currentPage - The current active page number.
 * @param {number} totalPages - The total number of pages.
 * @param {Function} onPageChange - The callback function called with the new page number.
 * @returns {void}
 */
const renderPagination = (containerId, currentPage, totalPages, onPageChange) => {
  const container = document.getElementById(containerId)
  container.innerHTML = ''

  // The previous button.
  const previousButton = createPageButton('<--', currentPage > 1, () => onPageChange(currentPage -1))
  container.appendChild(previousButton)

  // The page number buttons.
  const pageRange = getPageRange(currentPage, totalPages)
  pageRange.forEach((page) => {
    const button = createPageButton(page, true, () => onPageChange(page))
    if (Number(page) === Number(currentPage)) {
      button.classList.add('pagination-button--active')
    }
    container.appendChild(button)
  })

  // The next button.
  const nextButton = createPageButton('-->', currentPage < totalPages, () => onPageChange(currentPage + 1))
  container.appendChild(nextButton)
}

/**
 * Creates a single pagination button element.
 *
 * @param {string|number} label - The text to display on the button.
 * @param {boolean} isEnabled - Whether the button should be clickable or not.
 * @param {Function} onClick - The function to call when the button is being clicked.
 * @returns {HTMLButtonElement} - The created button element.
 */
const createPageButton = (label, isEnabled, onClick) => {
  const button = document.createElement('button')
  button.textContent = label
  button.classList.add('pagination-button')
  button.disabled = !isEnabled

  if (isEnabled) {
    button.addEventListener('click', onClick)
  }

  return button
}

/**
 * Calculates which page numbers to display around the current page.
 *
 * @param {number} currentPage - The current active page.
 * @param {number} totalPages - The total number of available pages.
 * @returns {Array<number>} - An array of page numbers to display.
 */
const getPageRange = (currentPage, totalPages) => {
  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)

  // Creates an array of number from start to end.
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}