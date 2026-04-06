/**
 * @file apiService.js
 * @description Handles all of the communication with the GraphQL API.
*/

import fetch from 'node-fetch'
import { config } from '../config/index.js'

/**
 * Sends a GraphQL mutation to log in an existing user.
 *
 * @param {string} username - The username to log in with.
 * @param {string} password - The password to log in with.
 * @returns {Promise<string|null>} - The JWT token if the login succeeded, otherwise null.
 */
const loginUser = async (username, password) => {
  // Sends the request to the GraphQL API.
  const response = await fetch(config.api.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
          }
        }
      `,
      variables: { username, password }
    })
  })

  const data = await response.json()
  return data.data?.login?.token || null
}

/**
 * Sends a GraphQL mutation to register a new user.
 *
 * @param {string} username - The username to register.
 * @param {string} password - The password to register with.
 * @returns {Promise<string>} - The JWT token from the API.
 * @throws {Error} - If the registration fails.
 */
const registerUser = async (username, password) => {
  // Sends the request to the GraphQL API.
  const response = await fetch(config.api.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation Register($username: String!, $password: String!) {
          register(username: $username, password: $password) {
            token
          }
        }
      `,
      variables: { username, password }
    })
  })

  const data = await response.json()
  console.log('Register response:', JSON.stringify(data, null, 2))

  if (!data.data?.register?.token) {
    throw new Error('Failed to register user with the API.')
  }

  return data.data.register.token
}

/**
 * Maps a GitHub user to an existing API user by attempting to login first.
 * Otherwise registering the user if the user does not exist yet.
 *
 * @param {object} githubUser - The GitHub user profile object.
 * @returns {Promise<string>} - The JWT token from the API.
 */
export const getJwtFromApi = async (githubUser) => {
  const username = `github_${githubUser.login}`
  // Uses a fixed password that is derived from the GitHub user ID.
  const password = `oauth_${githubUser.id}`

  const token = await loginUser(username, password)

  // Returns the token if login succeeded.
  if (token) {
    return token
  }

  // Registers the user if user does not exist yet.
  return registerUser(username, password)
}