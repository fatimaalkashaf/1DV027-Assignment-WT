/**
 * @file charts.js
 * @description Creates and updates the visualizations for the dashboard.
*/

/**
 * Creates a bar chart that shows total global sales per genre.
 *
 * @param {string} canvasId - The ID of the canvas element to render the chart in.
 * @param {Array<object>} data - An array of objects with genre and sales data.
 * @returns {Chart} - The created Chart.js instance.
 */
const createGenreSalesChart = (canvasId, data) => {
  const labels = data.map((item) => item.genre)
  const values = data.map((item) => item.totalSales)

  return new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Global Sales (millions)',
        data: values,
        backgroundColor: 'rgba(108, 99, 255, 0.7)',
        borderColor: 'rgba(108, 99, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.parsed.y.toFixed(2)}M`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sales (millions)'
          }
        }
      }
    }
  })
}

/**
 * Creates a doughnut chart that shows the sales distribution across regions.
 *
 * @param {string} canvasId - The ID of the canvas element to render the chart in.
 * @param {object} salesData - The object with regional sales figures.
 * @returns {Chart} - The created Chart.js instance.
 */
const createRegionalSalesChart = (canvasId, salesData) => {
  return new Chart(document.getElementById(canvasId), {
    type: 'doughnut',
    data: {
      labels: ['North America', 'Europe', 'Japan', 'Other'],
      datasets: [{
        data: [
          salesData.naSales,
          salesData.euSales,
          salesData.jpSales,
          salesData.otherSales
        ],
        backgroundColor: [
          'rgba(108, 99, 255, 0.8)',
          'rgba(99, 179, 237, 0.8)',
          'rgba(246, 173, 85, 0.8)',
          'rgba(104, 211, 145, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.parsed.toFixed(2)}M`
          }
        }
      }
    }
  })
}

/**
 * Creates a line chart that shows the number of game releases per year.
 *
 * @param {string} canvasId - The ID of the canvas element to render the chart in.
 * @param {Array<object>} data - The array of objects with year and count data.
 * @returns {Chart} - The created Chart.js instance.
 */
const createReleasesPerYearChart = (canvasId, data) => {
  const labels = data.map((item) => item.year)
  const values = data.map((item) => item.count)

  return new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Game Releases',
        data: values,
        borderColor: 'rgba(108, 99, 255, 1)',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of releases'
          }
        }
      }
    }
  })
}