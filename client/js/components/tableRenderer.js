/**
 * @file tableRenderer.js
 * @description Handles the rendering of the games table.
 */

/**
 * Renders the games table with the provided list of games.
 *
 * @param {Array<object>} games - An array of game objects to display.
 */
const renderGamesTable = (games) => {
  const tableBody = document.getElementById('games-table-body')
  tableBody.innerHTML = ''

  games.forEach((game) => {
    const row = createTableRow(game)
    tableBody.appendChild(row)
  })
}

/**
 * Creates a single table row element for a game.
 *
 * @param {object} game - The game object to create a row for.
 * @returns {HTMLTableRowElement} - The created table row element.
 */
const createTableRow = (game) => {
  const row = document.createElement('tr')
  // Fills the row with game data.
  row.innerHTML = `
    <td>${truncateText(game.name, 40)}</td>
    <td>${game.platform}</td>
    <td>${game.year || 'N/A'}</td>
    <td>${game.genre}</td>
    <td>${truncateText(game.publisher.name, 30)}</td>
    <td>${game.globalSales}M</td>
  `
  return row
}