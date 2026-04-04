/**
 * @file githubService.js
 * @description Handles all of the communication with the Github OAuth API.
*/

import fetch from 'node-fetch'
import { config } from '../config/index.js'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_USER_URL = 'https://api.github.com/user'

/**
 * Builds the Github authorization URL to redirect the user to.
 *
 * @returns {string} - The complete Github authorization URL.
 */
export const buildAuthorizationUrl = () => {
  const url = new URL(GITHUB_AUTHORIZE_URL)
  url.searchParams.append('client_id', config.github.clientId)
  url.searchParams.append('redirect_uri', config.github.callbackUrl)
  url.searchParams.append('scope', 'read:user')
  return url.toString()
}

/**
 * Exchanges a Github authorization code for an access token.
 *
 * @param {string} code - The authorization code received from Github.
 * @returns {Promise<string>} - The Github access token.
 * @throws {Error} - If the token exchange fails.
 */
export const exchangeCodeForToken = async (code) => {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code
    })
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(`Github token exchange failed: ${data.error_description}`)
  }

  return data.access_token
}

/**
 * Fetches the authenticated users profile from Github.
 *
 * @param {string} accessToken - A valid Github access token.
 * @returns {Promise<object>} - The Github user profile.
 * @throws {Error} - If the user profile fetch fails.
 */
export const fetchGithubUser = async (accessToken) => {
  const response = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Github user profile.')
  }

  return response.json()
}