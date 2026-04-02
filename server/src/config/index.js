/**
 * @file index.js
 * @description The central configuration module that loads and validates
 * all of the environment variables that is required by the server.
 */

import 'dotenv/config'

/**
 * Validates that a required environment variable exists.
 *
 * @param {string} name - The name of the environment variable.
 * @returns {string} - The value of the environment variable.
 * @throws {Error} - If the environment variable is not set.
 */
const requireEnvVariable = (name) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/**
 * The application configuration object.
 */
export const config = {
  github: {
    clientId: requireEnvVariable('GITHUB_CLIENT_ID'),
    clientSecret: requireEnvVariable('GITHUB_CLIENT_SECRET'),
    callbackUrl: requireEnvVariable('GITHUB_CALLBACK_URL')
  },
  api: {
    url: requireEnvVariable('API_URL')
  },
  server: {
    port: process.env.PORT || 3000,
    clientUrl: requireEnvVariable('CLIENT_URL')
  }
}