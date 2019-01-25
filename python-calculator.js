const { request } = require('@mattcbaker/blip')

async function calculator(left, right, operator) {
  const expression = { left, right, operator }

  const response = await request({
    url: 'http://localhost:8000',
    body: JSON.stringify(expression),
    method: 'POST',
    headers: {
      'Content-Length': JSON.stringify(expression).length
    }
  })

  return response.body.toString()
}

module.exports = calculator