/**
 * @file graphql.js
 * @description Handles all of the GraphQL requests to the Video Game Sales API.
 */

const API_URL = 'https://1dv027-api-design-graphql-production.up.railway.app/graphql'

/**
 * Sends a GraphQL query or mutation to the API.
 *
 * @param {string} query - The GraphQL query or mutation string.
 * @param {object} variables - The variables to pass with the query.
 * @param {string|null} token - The JWT token for authenticated requests.
 * @returns {Promise<object>} - The data returned from the API.
 * @throws {Error} - If the request fails or if the API returns errors.
 */
const sendGraphQLRequest = async (query, variables = {}, token = null) => {
  const headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  })

  const responseText = await response.text()

  if (!response.ok) {
    // If token is invalid or expired, clears it and redirects to login.
    if (response.status === 401) {
      removeToken()
      window.location.href = 'index.html'
      return
    }
    throw new Error(`Network error: ${response.status}`)
  }

  const result = JSON.parse(responseText)

  if (result.errors) {
    // If the token is expired, the API returns an authentication error.
    if (result.errors[0].message.toLowerCase().includes('auth')) {
      removeToken()
      window.location.href = 'index.html'
      return
    }
    throw new Error(result.errors[0].message)
  }

  return result.data
}

/**
 * Fetches a paginated list of games with optional filters.
 *
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of games per page.
 * @param {object} filters - Optional filters like genre, platform, publisher.
 * @param {string} token - The JWT token for authentication.
 * @returns {Promise<object>} - The games list and total count.
 */
const fetchGames = async (page, limit, filters = {}, token) => {
  const query = `
    query GetGames($offset: Int, $limit: Int, $genre: String, $platform: String) {
      games(offset: $offset, limit: $limit, genre: $genre, platform: $platform) {
        games {
          id
          name
          platform
          year
          genre
          publisher {
            name
          }
          naSales
          euSales
          jpSales
          otherSales
          globalSales
        }
        totalCount
      }
    }
  `

  return sendGraphQLRequest(query, {
    offset: (page - 1) * limit,
    limit,
    genre: filters.genre || undefined,
    platform: filters.platform || undefined
  }, token)
}

/**
 * Fetches the collected sales data grouped by genre.
 *
 * @param {string} token - The JWT token for authentication.
 * @returns {Promise<object>} - The publishers list with sales data.
 */
const fetchPublishers = async (token) => {
  const query = `
    query {
      publishers {
        publishers {
          name
          totalGames
          totalGlobalSales
        }
        totalCount
      }
    }
  `

  return sendGraphQLRequest(query, {}, token)
}

/**
 * Fetches all platforms with their collected statistics.
 *
 * @param {string} token - The JWT token for authentication.
 * @returns {Promise<object>} - The platforms list with statistics.
 */
const fetchPlatforms = async (token) => {
  const query = `
    query {
      platforms {
        platforms {
          name
          totalGames
          genres
          releaseYears
        }
        totalCount
      }
    }
  `

  return sendGraphQLRequest(query, {}, token)
}
