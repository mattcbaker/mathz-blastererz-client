const { tokenTypes } = require('./lexer')
const { operatorTypes } = require('./infix-parser')
const calculator = require('./python-calculator')

async function evaluator(expression) {
  switch (expression.type) {
    case operatorTypes.INFIX:
      return await evaluateInfixExpression(expression)
    case operatorTypes.PREFIX:
      return await evaluatePrefixExpression(expression)
    default:
      return expression
  }
}

async function evaluateInfixExpression(expression) {
  switch (expression.operator) {
    case tokenTypes.EQUALS:
      return await evaluateEqualsOperation(expression)
    case tokenTypes.VARIABLE:
      return await evaluateVariableOperation(expression)
    case tokenTypes.ADDITION:
    case tokenTypes.SUBTRACTION:
    case tokenTypes.MULTIPLICATION:
    case tokenTypes.DIVISION:
    case tokenTypes.EXPONENTIAL:
      return await evaluateInfixOperation(expression)
    default:
      throw new Error(`evaluator doesn't recognize operator ${expression.operator}`)
  }
}

function evaluatePrefixExpression(expression) {
  const operand = evaluateLiteralExpression(expression.operand)

  switch (expression.operator) {
    case tokenTypes.SUBTRACTION:
      return { type: tokenTypes.INTEGER, value: -operand + '' }
    default:
      throw new Error(`evaluator doesn't recognize prefix operator ${expression.operator}`)
  }
}

function evaluateLiteralExpression(expression) {
  return expression.value
}

async function evaluateInfixOperation(expression) {
  const leftExpression = await evaluator(expression.leftExpression)
  const rightExpression = await evaluator(expression.rightExpression)

  if (leftExpression.type === tokenTypes.INTEGER && rightExpression.type === tokenTypes.INTEGER) {
    return { type: tokenTypes.INTEGER, value: await calculator(leftExpression.value, rightExpression.value, tokenTypes.getOperatorSymbolFromTokenType(expression.operator)) }
  }

  return { ...expression, leftExpression: await evaluator(expression.leftExpression), rightExpression: await evaluator(expression.rightExpression) }
}

async function evaluateVariableOperation(expression) {
  return { ...expression, leftExpression: await evaluator(expression.leftExpression), rightExpression: await evaluator(expression.rightExpression) }
}

async function evaluateEqualsOperation(expression) {
  return { ...expression, leftExpression: await evaluator(expression.leftExpression), rightExpression: await evaluator(expression.rightExpression) }
}

module.exports = evaluator