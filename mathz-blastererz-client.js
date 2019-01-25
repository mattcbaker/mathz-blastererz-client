const { request } = require('@mattcbaker/blip')
const { solver } = require('./solver')

const userId = process.env.MATHZBLASTERERZ_USERID
const apiUrl = 'http://54.85.100.225:8000/api'

async function getQuestion(userId) {
  const response = await request({
    url: `${apiUrl}/math/${userId}`
  })

  if (response.statusCode !== 200) {
    throw new Error(`question api is giving me silly status code ${response.statusCode}`)
  }

  const body = JSON.parse(response.body.toString())

  return { literal: body.question, notation: body.notation }
}

async function sendAnswer(answer) {
  const response = await request({
    url: `${apiUrl}/math/${userId}`,
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ answer })
  })

  if (response.statusCode !== 200) {
    throw new Error(`answer api is giving me silly status code ${response.statusCode}`)
  }

  const body = JSON.parse(response.body.toString())

  if (body.result !== 'Correct!') {
    throw new Error(`Incorrect answer. My answer was ${answer}, correct answer is ${body.actual_correct_answer}. Server said ${response.body.toString()}`)
  }
}

async function main() {
  while (true) {
    const question = await getQuestion(userId)

    if (question.notation === 'Victory') {
      console.log('You won, good work.')
      return
    } else {
      console.log(`solving ${JSON.stringify(question)}`)

      const answer = await solver(question)

      await sendAnswer(answer)
    }
  }
}

main()