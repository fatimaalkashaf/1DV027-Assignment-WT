/**
 * @file navbar.js
 * @description Renders the navigation bar and handles user logout.
 */

/**
 * Initializes the navigation bar by setting up the logout button listener.
 * Clears the JWT token and redirects to the login page on logout.
 *
 * @returns {void}
 */
const initNavbar = () => {
  const logoutButton = document.getElementById('logout-button')

  logoutButton.addEventListener('click', async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout request failed:', error.message)
    } finally {
      // Always clears the token and redirects regardless of the server response.
      removeToken()
      window.location.href = 'index.html'
    }
  })
}