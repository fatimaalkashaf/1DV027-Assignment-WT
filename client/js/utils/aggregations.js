/**
 * @file aggregations.js
 * @description Functions for aggregating and processing the game sales data.
 */

/**
 * Aggregates the games data by genre and calculates total sales per genre.
 *
 * @param {Array<object>} games - An array of game objects.
 * @returns {Array<object>} - An array of objects with genre and totalSales.
 */
const aggregateSalesByGenre = (games) => {
  const genreMap = {}

  games.forEach((game) => {
    // Initializes the genre entry if it doesn't exist.
    if (!genreMap[game.genre]) {
      genreMap[game.genre] = 0
    }
    // Adds the game's global sales to the genre total.
    genreMap[game.genre] += game.globalSales
  })

  // Converts map to array of genre/totalSales objects.
  return Object.entries(genreMap).map(([genre, totalSales]) => ({ genre, totalSales }))
}

/**
 * Aggregates the games data by year and counts releases per year.
 *
 * @param {Array<object>} games - An array of game objects.
 * @returns {Array<object>} - An array of objects with year and count, sorted by year.
 */
const aggregateReleaseByYear = (games) => {
  const yearMap = {}

  games.forEach((game) => {
    if (!game.year) return
    // Initializes year entry if it doesn't exist.
    if (!yearMap[game.year]) {
      yearMap[game.year] = 0
    }
    yearMap[game.year]++
  })

  // Converts map to array and sorts the in time order.
  return Object.entries(yearMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year)
}

/**
 * Calculates the total regional sales across all games.
 *
 * @param {Array<object>} games - An array of game objects.
 * @returns {object} - Object with total sales per region.
 */
const aggregateRegionalSales = (games) => {
  // Sums up sales for each region across all games.
  return games.reduce((totals, game) => ({
    naSales: totals.naSales + (game.naSales || 0),
    euSales: totals.euSales + (game.euSales || 0),
    jpSales: totals.jpSales + (game.jpSales || 0),
    otherSales: totals.otherSales + (game.otherSales || 0)
  }), { naSales: 0, euSales: 0, jpSales: 0, otherSales: 0 })
}