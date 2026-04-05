/**
 * @file auth.js
 * @description The routes for handling the GitHub OAuth authentication flow.
*/

import express from 'express'
import { buildAuthorizationUrl, exchangeCodeForToken, fetchGithubUser } from '../services/githubService.js'
import { getJwtFromApi } from '../services/apiService.js'
import { config } from '../config/index.js'

const router = express.Router()

/**
 * Redirects the user to GitHub's OAuth authorization page.
 *
 * @param {object} req - The express request object.
 * @param {object} res - The express response object.
 * @returns {void}
*/
router.get('/github', (req, res) => {
  const authorizationUrl = buildAuthorizationUrl()
  res.redirect(authorizationUrl)
})

/**
 * Handles the GitHub OAuth callback and exchanges the code for a JWT.
 * Then redirects the user to t he dashboard with the token.
 *
 * @param {object} req - The express request object.
 * @param {object} res - The express response object.
 * @returns {Promise<void>}
*/
router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query

    // Ensures that the authorization code is present in the query string.
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is missing.' })
    }

    const githubAccessToken = await exchangeCodeForToken(code)
    const githubUser = await fetchGithubUser(githubAccessToken)
    const jwtToken = await getJwtFromApi(githubUser)

    // Redirects the user to the dashboard with the JWT as a query parameter.
    res.redirect(`${config.server.clientUrl}/dashboard.html?token=${jwtToken}`)
  } catch (error) {
    console.error('OAuth callback error:', error.message)
    res.redirect(`${config.server.clientUrl}/index.html?error=auth_failed`)
  }
})

/**
 * Instructs the client to clear the JWT token and logs the user out.
 *
 * @param {object} req - The express request object.
 * @param {object} res - The express response object.
 * @returns {void}
*/
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.'})
})

export default router