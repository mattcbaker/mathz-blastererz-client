const { tokenTypes } = require('./lexer')
const { operatorTypes } = require('./infix-parser')
const calculator = require('./python-calculator')

async function reducer(expression) {
  switch (expression.leftExpression.type) {
    case operatorTypes.INFIX:
      return await solve(expression) + ''
    default:
      return expression.leftExpression.value + ''
  }
}

async function solve(expression) {
  const leftExpression = expression.leftExpression.leftExpression
  const rightExpression = expression.leftExpression.rightExpression
  const resultExpression = expression.rightExpression

  // have to do this because blasters api sometimes gives result in a format like 2.0, instead of 2. e.g. "20 ? 10 = 2.0"
  if (resultExpression.type === tokenTypes.INTEGER) {
    resultExpression.value = await calculator(resultExpression.value, '0', tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.ADDITION))
  }

  switch (expression.leftExpression.operator) {
    case tokenTypes.ADDITION:
      if (rightExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.SUBTRACTION)
        return await calculator(resultExpression.value, leftExpression.value, operator)
      } else if (leftExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.SUBTRACTION)
        return await calculator(resultExpression.value, rightExpression.value, operator)
      }
    case tokenTypes.SUBTRACTION:
      if (rightExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.SUBTRACTION)
        return await calculator(leftExpression.value, resultExpression.value, operator)
      } else if (leftExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.ADDITION)
        return await calculator(resultExpression.value, rightExpression.value, operator)
      }
    case tokenTypes.MULTIPLICATION:
      if (rightExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.DIVISION)
        return await calculator(resultExpression.value, leftExpression.value, operator)
      } else if (leftExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.DIVISION)
        return await calculator(resultExpression.value, rightExpression.value, operator)
      }
    case tokenTypes.DIVISION:
      if (rightExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.DIVISION)
        return await calculator(leftExpression.value, resultExpression.value, operator)
      } else if (leftExpression.type === tokenTypes.VARIABLE) {
        const operator = tokenTypes.getOperatorSymbolFromTokenType(tokenTypes.MULTIPLICATION)
        return await calculator(rightExpression.value, resultExpression.value, operator)
      }
    case tokenTypes.EXPONENTIAL:
      if (rightExpression.type === tokenTypes.VARIABLE) {
        return await calculator(resultExpression.value, leftExpression.value, 'log')
      } else if (leftExpression.type === tokenTypes.VARIABLE) {
        return await calculator(resultExpression.value, rightExpression.value, 'root')
      }
    case tokenTypes.VARIABLE:
      if (leftExpression.type === tokenTypes.INTEGER && rightExpression.type === tokenTypes.INTEGER) {
        const candidates = tokenTypes.getOperatorSymbols()

        for (var i = 0; i < candidates.length; i++) {
          const answer = await calculator(leftExpression.value, rightExpression.value, candidates[i])

          if (answer === resultExpression.value) {
            return candidates[i]
          }
        }
      }
    default:
      throw new Error(`unknown operator ${operator}`)
  }
}

module.exports = reducer