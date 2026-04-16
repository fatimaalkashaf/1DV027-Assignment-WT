/**
 * @file dashboard.js
 * @description The main entry for the dashboard page.
 * Coordinates the data fetching, chart rendering, filtering, and pagination.
 */

const GAMES_PER_PAGE = 20

let currentPage = 1
let currentFilters = {}
let activeCharts = {}

/**
 * Initializes the dashboard by verifying the authentication,
 * loading all data, and setting up event listeners.
 *
 * @returns {Promise<void>}
 */
const initDashboard = async () => {
  const urlToken = getQueryParameter('token')

  if (urlToken) {
    saveToken(urlToken)
    // Cleans the token from URL without reloading the page.
    window.history.replaceState({}, document.title, 'dashboard.html')
  }

  const token = getToken()

  // Redirects to login if no token is found.
  if (!token) {
    window.location.href = 'index.html'
    return
  }

  initNavbar()
  await loadDashboardData(token)
  initFilters()
}

/**
 * Loads all dashboard data in parallel.
 *
 * @param {string} token - The JWT token for authentication.
 * @returns {Promise<void>}
 */
const loadDashboardData = async (token) => {
  try {
    // Fetches games, publishers, and platforms at the same time.
    const [gamesData, publishersData, platformsData] = await Promise.all([
      fetchGames(1, GAMES_PER_PAGE, {}, token),
      fetchPublishers(token),
      fetchPlatforms(token)
    ])

    renderOverviewStats(gamesData, publishersData, platformsData)
    renderAllCharts(gamesData.games.games)
    renderGamesTable(gamesData.games.games)
    renderPagination(
      'pagination-container',
      currentPage,
      Math.ceil(gamesData.games.totalCount / GAMES_PER_PAGE),
      (page) => onPageChange(page, token)
    )
  } catch (error) {
    console.error('Failed to load dashboard data:', error.message)
  }
}

/**
 * Renders the overview statistics cards.
 *
 * @param {object} gamesData - The games data from the API.
 * @param {object} publishersData - The publishers data from the API.
 * @param {object} platformsData - The platforms data from the API.
 */
const renderOverviewStats = (gamesData, publishersData, platformsData) => {
  // Updates each stat card with the total count.
  document.getElementById('total-games').textContent = formatNumber(gamesData.games.totalCount)
  document.getElementById('total-publishers').textContent = formatNumber(publishersData.publishers.totalCount)
  document.getElementById('total-platforms').textContent = formatNumber(platformsData.platforms.totalCount)
}

/**
 * Renders all charts by using aggregated data.
 * Destroys the existing charts before re-rendering to avoid any duplicates.
 *
 * @param {Array<object>} games - An array of game objects.
 */
const renderAllCharts = (games) => {
  Object.values(activeCharts).forEach((chart) => chart.destroy())
  activeCharts = {}

  // Creates each chart with the aggregated data.
  activeCharts.genreSales = createGenreSalesChart('genre-sales-chart', aggregateSalesByGenre(games))
  activeCharts.regionalSales = createRegionalSalesChart('regional-sales-chart', aggregateRegionalSales(games))
  activeCharts.releasesPerYear = createReleasesPerYearChart('releases-year-chart', aggregateReleaseByYear(games))
}

/**
 * Handles all page changes by fetching new data and updating the table.
 *
 * @param {number} page - The new page number to load.
 * @param {string} token - The JWT token for authentication.
 */
const onPageChange = async (page, token) => {
  currentPage = page
  const loadingIndicator = document.getElementById('loading-indicator')
  showElement(loadingIndicator)

  try {
    const gamesData = await fetchGames(page, GAMES_PER_PAGE, currentFilters, token)
    renderGamesTable(gamesData.games.games)
    renderPagination(
      'pagination-container',
      currentPage,
      Math.ceil(gamesData.games.totalCount / GAMES_PER_PAGE),
      (newPage) => onPageChange(newPage, token)
    )
  } catch (error) {
    console.error('Failed to load page:', error.message)
  } finally {
    hideElement(loadingIndicator)
  }
}

/**
 * Sets up event listeners for the filter inputs and buttons.
 */
const initFilters = () => {
  document.getElementById('apply-filters').addEventListener('click', applyFilters)
  document.getElementById('clear-filters').addEventListener('click', clearFilters)
}

/**
 * Applies the current filter values and reloads the games table.
 *
 * @returns {Promise<void>}
 */
const applyFilters = async () => {
  const token = getToken()
  // Resets to first page when filters change.
  currentPage = 1
  currentFilters = {
    genre: document.getElementById('filter-genre').value || undefined,
    platform: document.getElementById('filter-platform').value || undefined,
    publisher: document.getElementById('filter-publisher').value || undefined
  }

  const loadingIndicator = document.getElementById('loading-indicator')
  showElement(loadingIndicator)

  try {
    const gamesData = await fetchGames(currentPage, GAMES_PER_PAGE, currentFilters, token)
    renderGamesTable(gamesData.games.games)
    renderPagination(
      'pagination-container',
      currentPage,
      Math.ceil(gamesData.games.totalCount / GAMES_PER_PAGE),
      (page) => onPageChange(page, token)
    )
  } catch (error) {
    console.error('Failed to apply filters:', error.message)
  } finally {
    hideElement(loadingIndicator)
  }
}

/**
 * Clears all active filters and reloads the games table.
 *
 * @returns {Promise<void>}
 */
const clearFilters = async () => {
  document.getElementById('filter-genre').value = ''
  document.getElementById('filter-platform').value = ''
  document.getElementById('filter-publisher').value = ''
  currentFilters = {}
  currentPage = 1

  const token = getToken()
  const gamesData = await fetchGames(currentPage, GAMES_PER_PAGE, {}, token)
  renderGamesTable(gamesData.games.games)
  renderPagination(
    'pagination-container',
    currentPage,
    Math.ceil(gamesData.games.totalCount / GAMES_PER_PAGE),
    (page) => onPageChange(page, token)
  )
}

document.addEventListener('DOMContentLoaded', initDashboard)