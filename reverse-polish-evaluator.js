const calculator = require('./python-calculator')
const { tokenTypes } = require('./lexer')

async function reversePolishEvaluator(tokens) {
  const stack = []

  let token = tokens.consume()

  while (token.type !== 'EOF') {
    if (token.type === tokenTypes.INTEGER) {
      stack.push(token.literal)
    } else {
      switch (token.type) {
        case tokenTypes.ADDITION:
        case tokenTypes.MULTIPLICATION:
        case tokenTypes.SUBTRACTION:
        case tokenTypes.DIVISION:
          const right = stack.pop()
          const left = stack.pop()
          stack.push(await calculator(left, right, tokenTypes.getOperatorSymbolFromTokenType(token.type)))
          break
        case tokenTypes.EQUALS:
        case tokenTypes.VARIABLE:
          break
        default:
          throw new Error(`reverse polish evaluator doesn't know ${token.type}`)
      }
    }

    token = tokens.consume()
  }

  return stack.pop()
}

module.exports = reversePolishEvaluator