const assert = require('assert')
const { solver, notations } = require('./solver')
const calculator = require('./python-calculator')

describe('solver', () => {
  let tests = [
    { literal: '5 + 6 = ?', expected: '11', notation: notations.INFIX },
    { literal: '5 + 7 = ?', expected: '12', notation: notations.INFIX },
    { literal: '2 68 85 27 + + + = ?', expected: '182', notation: notations.REVERSE_POLISH },
    { literal: '-22.55 x -92.636 = ?', expected: '2088.942', notation: notations.INFIX },
    { literal: '5 x 3 = ?', expected: '15', notation: notations.INFIX },
    { literal: '-69.062 % 44 = ?', expected: '-1.57', notation: notations.INFIX },
    { literal: '76 ? 75 = 1.013', expected: '%', notation: notations.INFIX },
    { literal: '5 + 6 = ?', expected: '11', notation: notations.INFIX },
    { literal: '3 ^ 3 = ?', expected: '27', notation: notations.INFIX },
    { literal: '5 - 3 = ?', expected: '2', notation: notations.INFIX },
    { literal: '4 99 59 17 9 51 10 x - % % x + 35 53 16 22 8 8 42 x x + + + % 26 64 x 94 62 48 35 69 - - - - 78 47 67 99 50 85 35 45 42 52 - - + + + + - x + + + - - = ?', expected: '-182013.119', notation: notations.REVERSE_POLISH },
    { literal: '? ^ 3 = 27', expected: '3', notation: notations.INFIX },
    { literal: '20 ? 10 = 2.0', expected: '%', notation: notations.INFIX },
    { literal: '? + 6 = 11', expected: '5', notation: notations.INFIX },
    { literal: '51 ? 10 = 119042423827613001', expected: '^', notation: notations.INFIX },
  ]

  const filtered = tests.filter((test) => test.only)
  tests = (filtered.length) ? filtered : tests

  tests.forEach((test) => {
    it(`should return ${test.expected} for expression ${test.literal} with ${test.notation} notation`, asyncTest(async () => {
      const actual = await solver({ literal: test.literal, notation: test.notation })
      assert.deepStrictEqual(actual, test.expected)
    }))
  })
})

describe('python calculator', () => {
  const tests = [
    { left: '88', right: '10', operator: '^', expected: '27850097600940212224' },
    { left: '5', right: '10', operator: '+', expected: '15' },
    { left: '10', right: '5', operator: '-', expected: '5' },
    { left: '10', right: '5', operator: 'x', expected: '50' },
    { left: '20', right: '10', operator: '%', expected: '2' },
    { left: '9', right: '3', operator: 'log', expected: '2' },
  ]

  tests.forEach((test) => {
    const expression = { left: test.left, right: test.right, operator: test.operator }

    it(`should return ${test.expected} for expression ${JSON.stringify(expression)}`, asyncTest(async () => {
      const actual = await calculator(expression.left, expression.right, expression.operator)

      assert.deepStrictEqual(actual, test.expected)
    }))
  })
})

function asyncTest(fn) {
  return async (done) => {
    try {
      await fn()
      done()
    } catch (err) {
      done(err)
    }
  }
}