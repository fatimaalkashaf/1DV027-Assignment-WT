/**
 * @file server.js
 * @description The entry point for the Express server. Sets up the middleware,
 * routes, and also starts listening for the incoming requests.
*/

import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import authRoutes from './routes/auth.js'

const app = express()

/**
 * Configures CORS to only allow requests from the client application.
*/
app.use(cors({
  origin: config.server.clientUrl,
  credentials: true
}))

app.use(express.json())

/**
 * Redirects HTTP requests to HTTPS in production.
 *
 * @param {object} req - The express request object.
 * @param {object} res - The express response object.
 * @param {Function} next - The express next middleware function.
 * @returns {void}
*/
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`)
  }
  next()
})

// Attaches the authentication routes.
app.use('/auth', authRoutes)

/**
 * Starts the Express server and listens of the configured port.
*/
app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`)
})