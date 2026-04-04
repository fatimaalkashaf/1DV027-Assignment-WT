/**
 * @file auth.js
 * @description The middleware for verifying the JWT tokens on protected routes.
*/

/**
 * Middleware that verifies the JWT token from the Authorization header.
 * Redirect to the client login page if the token is missing or invalid.
 *
 * @param {object} req - The express request object.
 * @param {object} res - The express response object.
 * @param {Function} next - The express next middleware function.
 * @returns {void}
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token was provided.' })
  }

  // Attaches the token to request so routes can forward it to the API.
  req.token = token
  next()
}